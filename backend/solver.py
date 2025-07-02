import math
import copy
import random

# check that no two elements in a row are the same
def check_row(board: list, assigned: dict, row_index: int):
    # create a set for the values that have been seen within the row
    seen = set()

    # iterate over each element in a row
    for col_index, elem in enumerate(board[row_index]):
        if elem in seen and elem != -1:
            return False
        
        # if the (row, col) element was initially unassigned, then check "assigned" for updated values
        if elem == -1 and (row_index, col_index) in assigned:
            if assigned[(row_index, col_index)] in seen:
                return False
            else:
                seen.add(assigned[(row_index, col_index)])
        if (elem != -1):
            seen.add(elem)
    return True

# check that no two elements in a column are the same
def check_col(board: list, assigned: dict, col_index: int):
    seen = set()

    # iterate over column by visiting each row[col_index] value
    for row_index, row in enumerate(board):
        elem = row[col_index]
        if elem in seen and elem != -1:
            return False
        
        # if the (row, col) element was initially unassigned, then check "assigned" for updated values
        if elem == -1 and (row_index, col_index) in assigned:
            if assigned[(row_index, col_index)] in seen:
                return False
            else:
                seen.add(assigned[(row_index, col_index)])
        if (elem != -1):
            seen.add(elem)

    return True

# helper function for get_grid_indices, will return a (row, col) value for the start of the grid
def get_grid_indices(board: list, grid_number: int):
    # 3x3 grids numbered from 1-9, in row-major order
    match grid_number:
        case 0:
            return 0, 0
        case 1:
            return 3, 0
        case 2:
            return 6, 0
        case 3:
            return 3, 0
        case 4:
            return 3, 3
        case 5:
            return 3, 6
        case 6:
            return 6, 0
        case 7:
            return 6, 3
        case 8:
            return 6, 6

# check that no two elements in a grid are the same
def check_grid(board: list, assigned: dict, grid_number: int):
    seen = set()
    # get the starting row and column values
    start_row, start_col = get_grid_indices(board, grid_number)

    # define curr row and curr col for iterating over 3x3 grid
    curr_row = start_row
    curr_col = start_col
    while curr_row <= start_row + 2 and curr_col <= start_col + 2:
        elem = board[curr_row][curr_col]
        if elem in seen and elem != -1:
            return False
        
        # if the (row, col) element was initially unassigned, then check "assigned" for updated values
        if elem == -1 and (curr_row, curr_col) in assigned:
            if assigned[(curr_row, curr_col)] in seen:
                return False
            else:
                seen.add(assigned[(curr_row, curr_col)])
        if (elem != -1):
            seen.add(elem)

        # at end of grid row, go to beginning of next column
        if curr_row == start_row + 2:
            curr_row = start_row
            curr_col += 1
        else:
            curr_row += 1
    return True

# check that the current board and the assigned values satisfy the all-diff constraints for each row, column, and grid
def satisfies_constraints(board: list, assigned: dict):
    row_index = 0
    col_index = 0
    grid_index = 0
    while (row_index < 9):
        if not check_row(board, assigned, row_index):
            return False
        row_index += 1
    while (col_index < 9):
        if not check_col(board, assigned, col_index):
            return False
        col_index += 1

    while (grid_index < 9):
        if not check_grid(board, assigned, grid_index):
            return False
        grid_index += 1

    return True

# remove the value being assigned from domain of all (col, row) unassigned variables in the same row, column, or grid as the variable it is being assigned to
def forward_checking(to_assign: dict, possible_value: str, row_index: int, col_index: int):
    # iterate over all the unassigned variables
    for elem in to_assign:
            # calculate whether the element is in the same grid as the given element
            same_grid = (math.floor(row_index / 3) * 3 == math.floor(elem[0] / 3) * 3) and (math.floor(col_index / 3) * 3 == math.floor(elem[1] / 3) * 3)
            
            # check if the element is is the same row, column, or grid
            if (row_index == elem[0] or col_index == elem[1] or same_grid):
                    # check if the element has the possible value in the domain
                    if possible_value in to_assign[elem]:
                            # if it's the last value in the domain, then there must be a mistake, so return False to signal backtracking!
                            if (len(to_assign[elem]) == 1):
                                    return False
                            # otherwise, remove the value from the domain
                            else:
                                    to_assign[elem].remove(possible_value)

    # if none of the domains are left empty, then return True
    return True

# recursive helper function for solve
def recursive_backtracking(board: list, to_assign: dict, solutions: list, assigned: dict):
    # if assignment complete, then return assignment
    if (len(to_assign) == 0 and satisfies_constraints(board, assigned)):
        # add each assignment from assigned to the board and return the completed board
        for elem in assigned:
            board[elem[0]][elem[1]] = assigned[elem]

        current_solution = copy.deepcopy(board)

        # case: this is the first solution -> continue to see if there's another distinct one
        if len(solutions) == 0:
            solutions.append(current_solution)
            return True

        # case:  already seen this exact solution → it's unique
        if current_solution == solutions[0]:
            return True

        # case: solution is different → not unique
        solutions.append(current_solution)
        return False
    
    # sort the dictionary by domain size and get the variable with the smallest domain
    # note: elem is of the form ((row, col), ['possible_value1', 'possible_value2', etc])
    elem = sorted(to_assign.items(), key=lambda x: len(x[1]))[0]

    var = elem[0] # row, col
    values = elem[1][:] # domain list
    random.shuffle(values)

    # try each possible value in the element's domain until one works
    for possible_value in values:
        # make a copy of the variables and domains in to_assign, in case backtracking is triggered
        to_assign_copy = copy.deepcopy(to_assign)

        # add the assignment to assigned, remove the variable from to_assign
        assigned[var] = possible_value
        to_assign.pop(var)

        # if the assignment satisfies the constraints, and forward-checking doesn't leave any domains empty, recurse to next variable
        if satisfies_constraints(board, assigned) and forward_checking(to_assign, possible_value, var[0], var[1]):
            continue_search = recursive_backtracking(board, to_assign, solutions, assigned)
            # early exit
            if not continue_search:
                    return False
                
        # otherwise, backtrack by removing the assignment from assigned and restoring the to_assign
        assigned.pop(var)
        to_assign = to_assign_copy

    # case: no solution
    return True
        
# the main algorithm for solving the sudoku puzzle
def solve(board: list, to_assign: dict):
    assigned = {}
    # get the initial variables to assign with the calculated domains
    to_assign = calculate_initial_domains(board, to_assign)
    solutions = []

    # recursively backtrack until an answer is found
    is_unique = recursive_backtracking(board, to_assign, solutions, assigned)

    if len(solutions) == 0:
        return None, False  # no solution at all
    if is_unique:
        return solutions[0], True  # unique solution
    else:
        return solutions[0], False  # multiple solutions

# initialize the domains of the unassigned variables in to_assign
def calculate_initial_domains(board: list, to_assign: dict):
    # iterate over to_assign and calculate each domain
    for elem in to_assign:
            to_assign[elem] = calculate_domain(board, elem[0], elem[1])

    # order so that the elements with the smallest domain appear first
    return dict(sorted(to_assign.items(), key=lambda x: len(x[1])))

# calculate the domain of a (row, col) variable based on the other values in the row/col/grid
# NOTE: this function is only used before any assignments are made, so I did not bother to consider values that have been assigned when calculating domain
def calculate_domain(board: list, row_index: int, col_index: int):
    # start with all possible values 1-9 in domain
    domain = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    # iterate over the given row and remove the values of the other elements in the row
    for curr_col, elem in enumerate(board[row_index]):
        if elem in domain and elem != -1:
            domain.remove(elem)

    # iterate over the given column and remove the values of the other elements in the column
    for curr_row, elem in enumerate(board):
        if elem[col_index] in domain and elem[col_index] != -1:
            domain.remove(elem[col_index])

    # iterate over the given grid and remove the values of the other elements in the grid
    grid_row_start = (math.floor(row_index / 3) * 3)
    grid_col_start = (math.floor(col_index / 3) * 3)
    curr_row = grid_row_start 
    curr_col = grid_col_start
    
    while curr_row <= grid_row_start + 2 and curr_col <= grid_col_start + 2:
        elem = board[curr_row][curr_col]
        if elem in domain and elem != -1:
            domain.remove(elem)
        # if reached end of grid row, move to next col
        if curr_row == grid_row_start + 2:
            curr_row = grid_row_start
            curr_col += 1
        else:
            curr_row += 1
    return domain

def generate_board():
    # create empty 9 x 9 board
    board = [[-1 for _ in range(9)] for _ in range(9)]

    # populate to_assign
    to_assign = {}
    for row_index, row in enumerate(board):
        for col_index, elem in enumerate(row):
            to_assign[(row_index, col_index)] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        
    assigned = {}

    solutions = []
    new_board, is_unique = solve(board, to_assign)

    number_to_remove = random.randint(30, 60)
    removed = 0

    while (removed < number_to_remove):
        # pick a random filled cell
        row = random.randint(0, 8)
        col = random.randint(0, 8)

        # case: picked cell is already empty, so skip
        if new_board[row][col] == -1:
            continue
        
        # keep track of value that was removed, in case we have to restore
        temp = new_board[row][col]
        # set to -1 to remove the value
        new_board[row][col] = -1

        # prepare test board and to_assign for uniqueness check
        test_board = copy.deepcopy(new_board)
        test_to_assign = {(r, c): [] for r in range(9) for c in range(9) if test_board[r][c] == -1}
        test_to_assign = calculate_initial_domains(test_board, test_to_assign)

        _, still_unique = solve(test_board, test_to_assign)

        if still_unique:
            # removal successful
            removed += 1
        else:
            # restore and exit early
            new_board[row][col] = temp
            break

    return new_board
