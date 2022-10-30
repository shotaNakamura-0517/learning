# -*- coding: utf-8 -*-
 # 3.6シェルソート   
'''
ALDS_1_2_D :Shell Sort 
    shellSortは一定の間隔gだけ離れた要素のみを対象とした挿入ソートであるinsertionSortを
    最初は大きい値からgを狭めながら繰り返します。これをシェルソートといいます。
'''

import copy
from stop_watch import stop_watch
from algorithm_3_2 import InsertionSort

@stop_watch
def ShellSort  (sort_list , n):
    print('ShellSort:start')
    #print('リストサイズ:'+str(n))
    print(" ".join(map(str, sort_list)))
    G = []
    h = 1
    
    while h < n:
        #print('h:'+ str(h)) 
        G.append(h)
        h = 3*h + 1

    #print('ソート間隔リスト:' + " ".join(map(str, G)))    

    for i in range(len(G) - 1 , -1, -1):
        #print('ソート間隔:'+str(G[i]))
        InsertionSort(sort_list , n , G[i])
    print('ShellSort:end')

def main(): 
    print('main:start')
    sort_list = [5,2,4,6,1,3,99,3,49,88,44,100,5,2,4,6,1,3,99,3,49,88,44,100]
    ShellSort(sort_list , len(sort_list))
    print('main:end')

if __name__ == '__main__':
    main()