
"""
Emergency Priority Queue
A custom min-heap that serves the most urgent patient first.
Urgency 1 is the highest priority.
"""

class Patient:
    def __init__(self, name, urgency):
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Name must not be empty.")

        if not isinstance(urgency, int) or isinstance(urgency, bool):
            raise TypeError("Urgency must be an integer.")

        if urgency < 1 or urgency > 10:
            raise ValueError("Urgency must be between 1 and 10.")

        self.name = name
        self.urgency = urgency


class MinHeap:
    def __init__(self):
        self.data = []

    def heapify_up(self, index):
        """Move a patient upward to restore heap order."""
        while index > 0:
            parent = (index - 1) // 2

            if self.data[index].urgency < self.data[parent].urgency:
                self.data[index], self.data[parent] = (
                    self.data[parent],
                    self.data[index]
                )
                index = parent
            else:
                break

    def heapify_down(self, index):
        """Move a patient downward to restore heap order."""
        size = len(self.data)

        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            smallest = index

            if (
                left < size
                and self.data[left].urgency
                < self.data[smallest].urgency
            ):
                smallest = left

            if (
                right < size
                and self.data[right].urgency
                < self.data[smallest].urgency
            ):
                smallest = right

            if smallest == index:
                break

            self.data[index], self.data[smallest] = (
                self.data[smallest],
                self.data[index]
            )

            index = smallest

    def insert(self, patient):
        """Add a patient and restore heap order."""
        if not isinstance(patient, Patient):
            raise TypeError("Must insert a Patient object.")

        self.data.append(patient)
        self.heapify_up(len(self.data) - 1)

    def print_heap(self):
        """Print the current patient queue."""
        print("Current Queue:")

        if not self.data:
            print("- (empty)")
            return

        for patient in self.data:
            print(f"- {patient.name} ({patient.urgency})")

    def peek(self):
        """Return the most urgent patient without removing them."""
        if not self.data:
            return None

        return self.data[0]

    def remove_min(self):
        """Remove and return the most urgent patient."""
        if not self.data:
            return None

        most_urgent = self.data[0]
        last_patient = self.data.pop()

        if self.data:
            self.data[0] = last_patient
            self.heapify_down(0)

        return most_urgent


# Test the emergency queue
if __name__ == "__main__":
    heap = MinHeap()

    heap.insert(Patient("Jordan", 3))
    heap.insert(Patient("Taylor", 1))
    heap.insert(Patient("Avery", 5))

    heap.print_heap()

    next_up = heap.peek()

    if next_up is not None:
        print("Next patient:", next_up.name, next_up.urgency)

    served = heap.remove_min()

    if served is not None:
        print("Patient served:", served.name)

    heap.print_heap()
