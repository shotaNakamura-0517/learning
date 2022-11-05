# -*- coding: utf-8 -*-
 # 4.2スタック   
'''
ALDS_1_3_A :Stack 
    ラウンドロビンスケジューリングをシミュレートするプログラムを出力してください。
    入力：入力形式は以下の通りです。
            n q
            name_1 time_1
            name_2 time_2
    出力：プロセスが完了した順に各プロセスの名前と終了時間を空白で区切って1行に出力してください。
'''

import copy
from stop_watch import stop_watch
from doublyLinkedList import DoublyLinkedList


class commandList: 
    def __init__(self , command , val , index=0):
        self.command = command
        self.val = int(val)
        self.index = index

def outputDoublyLinkedList(list_):
    output = list_.head
    count = 0
    while count < list_.length -1 :
        print(str(output.val),end=',')
        output = output.next
        count += 1
    print(output.val)


@stop_watch       
def main(): 
    print('main:start')
    input = [commandList('unshift',5),commandList('unshift',2),commandList('unshift',3),commandList('unshift',1),commandList('delete',3),commandList('unshift',6),commandList('delete',5),commandList('delete',2),commandList('delete',5),commandList('unshift',5),commandList('unshift',2),commandList('unshift',3),commandList('unshift',1),commandList('delete',5),commandList('insert',5,4)]
    list_ = DoublyLinkedList()

    for elm in input:
        if elm.command == 'unshift':
            list_.unshift(elm.val)
            #outputDoublyLinkedList(list_)
        elif elm.command == 'insert':
            list_.insert(elm.index , elm.val)
        elif elm.command == 'delete':
            #list_.delete(elm.val)
            index = list_.getIndex(elm.val)
            #outputDoublyLinkedList(list_)
            #print(elm.val)
            #print(index)
            list_.remove(index)
            #outputDoublyLinkedList(list_)
        elif elm.command == 'delteFirst':
            list_.shift()
            #outputDoublyLinkedList(list_)
        elif elm.command == 'deleteLast':
            list_.pop()
            #outputDoublyLinkedList(list_)
        else:
            print('実行可能なコマンドではありません')

    outputDoublyLinkedList(list_)
    index = list_.getIndex(1)
    print(index)
    index = list_.getIndex(3)
    print(index)
    index = list_.getIndex(2)
    print(index)
    index = list_.getIndex(6)
    print(index)
    index = list_.getIndex(5)
    print(index)
    outputDoublyLinkedList(list_.reverse())
    list_ = DoublyLinkedList()
    index = list_.getIndex(1)
    print(index)

    print('main:end')

if __name__ == '__main__':
    main()