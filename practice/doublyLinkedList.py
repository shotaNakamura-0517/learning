#https://qiita.com/gonbe/items/695671ae751ce6717ffb

class Node:
    def __init__(self, val):
        self.val = val
        next = None
        prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.length = 0

    def push(self,val):
        newNode = Node(val)
        if (not self.head):
            self.head = newNode
            self.tail = self.head
        else:
            self.tail.next = newNode
            newNode.prev = self.tail
            self.tail = newNode

        self.length = self.length + 1
        return self

    def pop(self):
        if(not self.head):
            return None

        currentTail = self.tail
        if (self.length == 1):
            self.tail = None
            self.head = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
            currentTail.prev = None

        self.length = self.length - 1
        return currentTail

    def shift(self):
        if (self.length == 0):
            return None
        oldHead = self.head
        if (self.length == 1):
            self.head = None
            self.tail = None
        else:
            self.head = oldHead.next

        self.length = self.length - 1
        return oldHead

    def unshift(self, val):
        newNode = Node(val)
        if (self.length == 0):
            self.head = newNode
            self.tail = newNode
        else:
            self.head.prev = newNode
            newNode.next = self.head
            self.head = newNode
        self.length = self.length + 1
        return self

    def get(self, index):
        if ((index < 0) or (index > self.length)):
            return None

        halfOfLength = self.length // 2
        if (index <= halfOfLength):
            counter = 0
            current = self.head
            while(counter != index):
                current = current.next
                counter = counter + 1
            return current
        elif (index > halfOfLength):
            counter = self.length - 1
            current = self.tail
            while(counter != index):
                current = current.prev
                counter = counter - 1
            return current

    def set(self, index, val):
        targetNode = self.get(index)
        if(targetNode):
            targetNode.val = val
            return True
        else:
            return False

    def insert(self, index, val):
        if((index < 0) or (index > self.length)):
            return False
        if (index == 0):
            return self.unshift(val)
        if (index == self.length):
            return self.push(val)
        prevNode = self.get(index - 1)
        newNode = Node(val)
        nextNode = prevNode.next
        prevNode.next = newNode
        newNode.prev = prevNode
        nextNode.prev = newNode
        newNode.next = nextNode
        self.length = self.length + 1
        return True

    def remove(self, index):
        if((index < 0) or (index >= self.length)):
            return None
        if (index == 0):
            return self.shift()
        if (index == self.length - 1):
            return self.pop()
        removedNode = self.get(index)
        removedNode.prev.next = removedNode.next
        removedNode.next.prev = removedNode.prev
        removedNode.next = None
        removedNode.prev = None

        self.length = self.length - 1
        return removedNode

    def reverse(self):
        Node = self.head
        self.head = self.tail
        self.tail = Node

        tmpPrev = None
        tmpNext = None
        
        tmpNext = Node.next
        Node.next = None
        Node.prev = tmpNext
        Node = Node.prev

        while(Node):
            tmpPrev = Node.prev
            tmpNext = Node.next
            Node.next = tmpPrev
            Node.prev = tmpNext
            Node = Node.prev
            #if Node!=None:
                #print('値:' + str(Node.val))
                #print('前:' + str(Node.prev))
                #print('後:' + str(Node.next))

        return self

#以下、自分で実装
    def delete(self , val):
        #print('delete:start')
        if (not self.head):
            return False
        target = self.head
        count = 0
        #while target.val != val and count < self.length -1 :
        while target!=None and target.val != val:
            target = target.next
            count += 1

        if target!=None and target.val == val:
            if target == self.head:
                return self.shift()
            elif target == self.tail:
                return self.pop()
            else:
                target.prev.next = target.next
                target.next.prev = target.prev
                self.length = self.length - 1
        return self

    def getIndex(self , val):
        if (not self.head):
            return -1
        target = self.head
        count = 0
        #while target.val != val and count < self.length -1 :
        while target!=None and target.val != val:
            target = target.next
            count += 1

        if target!=None and target.val == val:
            return count
        else:
            return -1