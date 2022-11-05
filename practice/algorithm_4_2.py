# -*- coding: utf-8 -*-
 # 4.2スタック   
'''
ALDS_1_3_A :Stack 
    逆ポーランド記法で与えられた数式の計算結果を出力してください。
    入力：1つの数式が1行に与えられます。連続するシンボルは1つの空白で区切られて与えられます。
    出力：計算結果を1行に出力してください。
'''

import copy
from stop_watch import stop_watch
import operator as op
import re

op_dict = {
       '+': op.add,
       '-': op.sub,
       '*': op.mul,
       '/': op.truediv
        }

@stop_watch
def calcReversePolishNotation  (list_):
    print('calcReversePolishNotation:start')
    print(list_)
    num_list = []
    result_list = []
    result = None
    stack_top = None
    list_.reverse()
    #print(list_)

    for i in  range(len(list_)-1 , -1 , -1):
        #print(i)
        stack_top = list_.pop()
        if stack_top in ['+','-','*','/']:
            if num_list:
                result_list.append(calc_(num_list , stack_top))
                #print(result_list)
                num_list.clear()
            else:
                result = calc_(result_list , stack_top)
                result_list.clear()
        elif  stack_top.isdecimal(): 
            num_list.append(int(stack_top))
            #print(num_list)
        else:
            print('数値ではありません')
    if result != None and not result_list:
        print('計算結果：' + str(result))
    else:
        print('入力値が不正です')

    print('calcReversePolishNotation:end')

'''
要素の逆順でループ(そもそもスタックからpopする必要がないなら順ループで実装可能)
    #ループで逆順から参照してくれるので不要
    #list_.reverse()
    for elm in reversed(list_):
        if elm in ['+','-','*','/']:
            if num_list:
                result_list.append(calc_(num_list , elm))
                num_list.clear()
            else:
                result = calc_(result_list , elm)
                result_list.clear()
        elif  elm.isdecimal(): 
            num_list.append(int(list_.pop()))
        else:
            print('数値ではありません')
'''

def calc_(list_ , ope):
    #print(list_)
    #print(ope)
    return op_dict[ope](*list_)

def main(): 
    print('main:start')
    input = ['1','2','a','-','3','4','-','*']
    calcReversePolishNotation(input.copy())
    print('main:end')

if __name__ == '__main__':
    main()