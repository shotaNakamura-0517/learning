# -*- coding: utf-8 -*-
 # 4.4連結リスト   
'''
ALDS_1_3_C : Doubly Linked List
    以下の命令を受け付ける双方向連結リストを実装してください
    unshift x   :連結リストの先頭にキーxを持つ要素を継ぎ足す
    insert x , y:連結リストのy番目にキーxを持つ要素を継ぎ足す
    delete x    :キーxを持つ最初の要素を削除する
    deleteFirst :連結リストの先頭の要素を削除する
    deleteLast  :連結リストの末尾の要素を削除する
    reverse     :連結リストを逆順にして返却する

    入力：入力形式は以下の通りです。
            n 
            commandList_1
            commandList_2
    出力：各行の命令実行後に連結配列をカンマ区切りで出力してください。
'''

import copy
from stop_watch import stop_watch
from doublyLinkedList import DoublyLinkedList


class commandList: 
    def __init__(self , command , val=0 , index=0):
        self.command = command
        self.val = int(val)
        self.index = index

def outputDoublyLinkedList(command , val , list_):
    output = list_.head
    count = 0

    print(command + '(key-' + str(val) + ')',end=':')
    while count < list_.length -1 :
        print(str(output.val),end=',')
        output = output.next
        count += 1
    print(output.val)


@stop_watch       
def main(): 
    print('main:start')
    input = [commandList('unshift',5),commandList('unshift',2),commandList('unshift',3),commandList('unshift',1),commandList('delete',3),commandList('unshift',6),\
            commandList('delete',5),commandList('delete',2),commandList('delete',5),commandList('unshift',5),commandList('unshift',2),commandList('unshift',3),\
            commandList('unshift',1),commandList('delete',5),commandList('insert',5,4),commandList('delete',1),commandList('reverse')]
    list_ = DoublyLinkedList()

    for elm in input:
        if elm.command == 'unshift':
            list_.unshift(elm.val)
            outputDoublyLinkedList(elm.command, elm.val , list_)
        elif elm.command == 'insert':
            list_.insert(elm.index , elm.val)
            outputDoublyLinkedList(elm.command, elm.val , list_)
        elif elm.command == 'delete':
            index = list_.getIndex(elm.val)
            list_.remove(index)
            outputDoublyLinkedList(elm.command, elm.val , list_)
        elif elm.command == 'delteFirst':
            list_.shift()
            outputDoublyLinkedList(elm.command, elm.val , list_)
        elif elm.command == 'deleteLast':
            list_.pop()
            outputDoublyLinkedList(elm.command, elm.val , list_)
        elif elm.command == 'reverse':
            list_.reverse()
            outputDoublyLinkedList(elm.command, elm.val , list_)
        else:
            print('実行可能なコマンドではありません')

    #outputDoublyLinkedList(list_)
    #index = list_.getIndex(1)
    #print(index)
    #index = list_.getIndex(3)
    #print(index)
    #index = list_.getIndex(2)
    #print(index)
    #index = list_.getIndex(6)
    #print(index)
    #index = list_.getIndex(5)
    #print(index)
    #list_ = DoublyLinkedList()
    #index = list_.getIndex(1)
    #print(index)

    print('main:end')

if __name__ == '__main__':
    main()