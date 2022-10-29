# -*- coding: utf-8 -*-
 # 3.5安定なソート   
'''
ALDS_1_2_A :Stable Sort 
    数列Aを読み込み、バブルソート及び選択ソートのアルゴリズムを用いて、
    与えられたN枚のカードをそれらの数字を基準に昇順に並べ替え出力するプログラムを作成してください。
'''

import copy
from operator import truediv
from stop_watch import stop_watch

class card(object):
    def __init__(self , suit , value):
        self.suit = suit
        self.value = value

def BubbleSort  (sort_list):
    print('BubbleSortAns:start')
    print(" ".join(map(lambda card:card.suit+str(card.value), sort_list)))
    continueFlg = True
    i = 0
    while continueFlg:
        continueFlg = False
        for j in range(len(sort_list)-1 , i , -1):
            if sort_list[j].value < sort_list[j - 1].value: 
                tmp = sort_list[j - 1]
                sort_list[j - 1] = sort_list[j]
                sort_list[j] = tmp
                continueFlg = True
        i += 1
    print(" ".join(map(lambda card:card.suit+str(card.value), sort_list)))
    print('BubbleSortAns:end')

def SelectionSort  (sort_list):
    print('SelectionSortAns:start')
    print(" ".join(map(lambda card:card.suit+str(card.value), sort_list)))
    for i in range(0 , len(sort_list)):
        minJ = i
        for j in range(i , len(sort_list)):
            if sort_list[j].value < sort_list[minJ].value: 
                minJ = j
        tmp = sort_list[i]
        sort_list[i] = sort_list[minJ]
        sort_list[minJ] = tmp
    print(" ".join(map(lambda card:card.suit+str(card.value), sort_list)))
    print('SelectionSortAns:end')


def isStable  (sort_list_1 , sort_list_2 , n):
    print('isStable:start')
    for i in range(0 , n):
        if sort_list_1[i].value != sort_list_2[i].value:
            print('ソート結果が一致していません')
            return False
        if sort_list_1[i].suit != sort_list_2[i].suit:
            print('isStable:end')
            return False
    print('isStable:end')
    return True

def main(): 
    print('main:start')
    sort_list_1 = [card('H' , 4) , card('C', 9) , card('S' , 4) , card('D' , 2) , card('C' , 3)]
    sort_list_2 = list(sort_list_1)
    BubbleSort(sort_list_1)
    SelectionSort(sort_list_2)
    if isStable(sort_list_1 , sort_list_2 , len(sort_list_1)):
        print('Stable')
    else:
        print('Not Stable')       
    print('main:end')

if __name__ == '__main__':
    main()