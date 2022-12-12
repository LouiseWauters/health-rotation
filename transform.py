

def read_file(input_file_name):
    items = dict()
    current_category = None
    with open(input_file_name, 'r') as file:
        for line in file:
            stripped_line = line.strip()
            if len(stripped_line) > 0:
                if stripped_line.upper() == stripped_line:
                    current_category = stripped_line.capitalize()
                    items[current_category] = list()
                else:
                    items[current_category].append(stripped_line)
    return items


def write_file(output_file_name, food):
    with open(output_file_name, 'w') as file:
        file.write('export const FOODITEMS: FoodItem[] = [\n')
        for category in food:
            file.write(f'\t{{ foodGroup: \'{category}\', foodItems:[\n')
            for item in food[category]:
                file.write(f'\t\t\t{{ name: \'{item}\' }},\n')
            file.write(f'], selected: [] }},\n')


if __name__ == '__main__':
    food = read_file('list.txt')
    write_file('try_out.ts', food)


