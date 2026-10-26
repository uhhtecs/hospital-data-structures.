
"""
Doctor Reporting Tree
A binary tree that stores doctors and their direct reports.
"""

class DoctorNode:
    def __init__(self, name):
        self.name = name
        self.left = None
        self.right = None


class DoctorTree:
    def __init__(self):
        self.root = None

    def _find(self, node, name):
        """Find a doctor by name."""
        if node is None:
            return None

        if node.name == name:
            return node

        found = self._find(node.left, name)

        if found is not None:
            return found

        return self._find(node.right, name)

    def insert(self, parent_name, doctor_name, side):
        """Insert a doctor on the left or right of a parent."""
        if side not in ("left", "right"):
            return False

        if not isinstance(doctor_name, str) or not doctor_name.strip():
            return False

        parent = self._find(self.root, parent_name)

        if parent is None:
            return False

        if getattr(parent, side) is not None:
            return False

        setattr(parent, side, DoctorNode(doctor_name))
        return True

    def preorder(self, node):
        """Visit root, left subtree, right subtree."""
        if node is None:
            return []

        return (
            [node.name]
            + self.preorder(node.left)
            + self.preorder(node.right)
        )

    def inorder(self, node):
        """Visit left subtree, root, right subtree."""
        if node is None:
            return []

        return (
            self.inorder(node.left)
            + [node.name]
            + self.inorder(node.right)
        )

    def postorder(self, node):
        """Visit left subtree, right subtree, root."""
        if node is None:
            return []

        return (
            self.postorder(node.left)
            + self.postorder(node.right)
            + [node.name]
        )


# Test the doctor tree
if __name__ == "__main__":
    tree = DoctorTree()
    tree.root = DoctorNode("Dr. Croft")

    tree.insert("Dr. Croft", "Dr. Goldsmith", "right")
    tree.insert("Dr. Croft", "Dr. Phan", "left")
    tree.insert("Dr. Phan", "Dr. Carson", "right")
    tree.insert("Dr. Phan", "Dr. Morgan", "left")

    print("Preorder:", tree.preorder(tree.root))
    print("Inorder:", tree.inorder(tree.root))
    print("Postorder:", tree.postorder(tree.root))
