# -*- coding: utf-8 -*-
 # 3.2 挿入ソート  
'''
ALDS_1_1_A :Insertion Sort 
    N個の要素を含む数列Aを昇順に並び替える挿入ソートのプログラムを作成してください。
    アルゴリズムの動作を確認するため、各計算ステップでの配列を出力してください。
'''

from stop_watch import stop_watch

@stop_watch
def InsertionSort  (sort_list):
    print('InsertionSort:start')
    print(" ".join(map(str, sort_list)))
    for i in range(1,len(sort_list)):
        v = sort_list[i]
        j = i - 1
        while j>=0 and sort_list[j] > v:
            sort_list[j + 1] = sort_list[j]
            j -= 1
        sort_list[j + 1] = v
        print(" ".join(map(str, sort_list)))
    print('InsertionSort:end')

def main(): 
    print('main:start')
    sort_list = [5,2,4,6,1,3]
    InsertionSort(sort_list)
    print('main:end')

if __name__ == '__main__':
    main()