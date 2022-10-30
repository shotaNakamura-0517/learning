# -*- coding: utf-8 -*-
 # 3.3バブルソート   
'''
ALDS_1_2_A :Bubble Sort 
    数列Aを読み込み、バブルソートで昇順に並べ替え出力するプログラムを作成してください。
    バブルソートが行われた要素の交換回数も出力してください。
'''

import copy
from stop_watch import stop_watch

@stop_watch
def BubbleSort  (sort_list):
    print('BubbleSort:start')
    print(" ".join(map(str, sort_list)))
    continueFlg = True
    exchangeCnt = 0
    while continueFlg:
        continueFlg = False
        for i in range(len(sort_list)-1 , 0 , -1):
            if sort_list[i] < sort_list[i - 1]: 
                tmp = sort_list[i - 1]
                sort_list[i - 1] = sort_list[i]
                sort_list[i] = tmp
                continueFlg = True
                exchangeCnt += 1
    print(" ".join(map(str, sort_list)))
    print(exchangeCnt)
    print('BubbleSort:end')

@stop_watch
def BubbleSortAns  (sort_list):
    print('BubbleSortAns:start')
    print(" ".join(map(str, sort_list)))
    continueFlg = True
    exchangeCnt = 0
    i = 0
    while continueFlg:
        continueFlg = False
        #print(i)
        for j in range(len(sort_list)-1 , i , -1):
            #print(j)
            if sort_list[j] < sort_list[j - 1]: 
                tmp = sort_list[j - 1]
                sort_list[j - 1] = sort_list[j]
                sort_list[j] = tmp
                continueFlg = True
                exchangeCnt += 1
        i += 1
    print(" ".join(map(str, sort_list)))
    print(exchangeCnt)
    print('BubbleSortAns:end')


def main(): 
    print('main:start')
    sort_list = [5,2,4,6,1,3]
    BubbleSort(copy.copy(sort_list))
    BubbleSortAns(copy.copy(sort_list))
    print('main:end')

if __name__ == '__main__':
    main()