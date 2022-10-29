# -*- coding: utf-8 -*-
 # 3.4選択ソート   
'''
ALDS_1_2_A :Bubble Sort 
    数列Aを読み込み、選択ソートで昇順に並べ替え出力するプログラムを作成してください。
    ソートが行われた要素の交換回数も出力してください。
'''

import copy
from operator import truediv
from stop_watch import stop_watch

@stop_watch
def SelectionSort  (sort_list):
    print('SelectionSort:start')
    print(" ".join(map(str, sort_list)))
    exchangeCnt = 0
    for i in range(0 , len(sort_list)):
        #print('i:'+str(i))
        minJ = i
        for j in range(i , len(sort_list)):
            #print('j:'+str(j))
            if sort_list[j] < sort_list[minJ]: 
                minJ = j
        if i!= minJ:
            tmp = sort_list[i]
            sort_list[i] = sort_list[minJ]
            sort_list[minJ] = tmp
            exchangeCnt += 1
            #print(" ".join(map(str, sort_list)))
    print(" ".join(map(str, sort_list)))
    print(exchangeCnt)
    print('SelectionSort:end')

@stop_watch
def SelectionSortAns  (sort_list):
    print('SelectionSortAns:start')
    print(" ".join(map(str, sort_list)))
    exchangeCnt = 0
    for i in range(0 , len(sort_list)):
        #print('i:'+str(i))
        minJ = i
        for j in range(i , len(sort_list)):
            #print('j:'+str(j))
            if sort_list[j] < sort_list[minJ]: 
                minJ = j
        tmp = sort_list[i]
        sort_list[i] = sort_list[minJ]
        sort_list[minJ] = tmp
        if i!= minJ:
            exchangeCnt += 1
            #print(" ".join(map(str, sort_list)))
    print(" ".join(map(str, sort_list)))
    print(exchangeCnt)
    print('SelectionSortAns:end')


def main(): 
    print('main:start')
    sort_list = [5,2,4,6,1,3]
    SelectionSort(copy.copy(sort_list))
    SelectionSortAns(copy.copy(sort_list))
    print('main:end')

if __name__ == '__main__':
    main()