
class Contact:
    def __init__(self, name, number):
        self.name = name
        self.number = number

    def __str__(self):
        return f"{self.name}: {self.number}"


class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None


class HashTable:
    def __init__(self, size):
        self.size = size
        self.data = [None] * size

    def hash_function(self, key):
        total = 0
        for character in key:
            total += ord(character)
        return total % self.size

    def insert(self, key, value):
        index = self.hash_function(key)

        # Create a Contact object
        contact = Contact(key, value)

        # If the index is empty, add a new node
        if self.data[index] is None:
            self.data[index] = Node(key, contact)
            return

        # Check the linked list for duplicates
        current = self.data[index]

        while current is not None:
            if current.key == key:
                current.value.number = value
                return

            if current.next is None:
                break

            current = current.next

        # Add a new node to handle the collision
        current.next = Node(key, contact)

    def search(self, key):
        index = self.hash_function(key)
        current = self.data[index]

        while current is not None:
            if current.key == key:
                return current.value

            current = current.next

        return None

    def print_table(self):
        for index in range(self.size):
            print(f"Index {index}:", end=" ")

            current = self.data[index]

            if current is None:
                print("Empty")
            else:
                while current is not None:
                    print(f"- {current.value}", end=" ")
                    current = current.next

                print()


# TESTING THE HASH TABLE

table = HashTable(10)

print("Initial Hash Table:")
table.print_table()

# Add contacts
table.insert("John", "909-876-1234")
table.insert("Rebecca", "111-555-0002")
table.insert("Amy", "111-222-3333")
table.insert("May", "222-333-1111")

print("\nUpdated Hash Table:")
table.print_table()

# Search for a contact
contact = table.search("John")
print("\nSearch result:", contact)

# Test duplicate contact
table.insert("Rebecca", "999-444-9999")

print("\nAfter Updating Rebecca:")
table.print_table()

# Test searching for a missing contact
print("\nSearching for Chris:", table.search("Chris"))


# DESIGN MEMO (200-300 WORDS)

"""
Design Memo:

A hash table is a good data structure for a contact management
system because it allows information to be found quickly. Instead
of searching through every contact one by one, a hash function
converts a contact's name into an index in an array. This makes
finding, adding, and updating contacts much faster on average.
Hash tables are especially useful when a system needs to manage
hundreds or thousands of contacts.

For this project, I used separate chaining to handle collisions.
A collision happens when two different contact names produce
the same index in the hash table. To solve this problem, I used
linked lists with Node objects. Each node stores a contact's name,
the Contact object, and a reference to the next node. When two
contacts share an index, the new contact is added to the linked
list. I also made sure that inserting a contact with an existing
name updates its phone number instead of creating a duplicate.

An engineer might choose a hash table over a list when fast
searching is important and information needs to be accessed
using a unique key. A list may require checking each item
individually, which takes longer as the collection grows.
A tree can also provide efficient searching and is useful when
data needs to stay sorted. However, a hash table is often a
better choice when the main goal is quickly finding information
without needing it to be in a particular order.

Overall, this project helped me understand hashing, linked lists,
and how collisions can be handled in a data structure.
"""
