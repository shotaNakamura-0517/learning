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
from collections import deque

class process(object):
    def __init__(self , name , time):
        self.name = name
        self.time = int(time)

@stop_watch
def simulateRoundrobinCpuScheduling  (list_ , q):
    print('simulateRoundrobinCpuScheduling:start')
    result = []
    que_top = None
    processing_time = 0
    que = deque(list_)
    print(que)

    while que:
        que_top = que.popleft()
        que_top.time -= q
        print('処理プロセス名：' + que_top.name)
        if(que_top.time<0):
            processing_time+=(q + que_top.time)
            result.append(que_top.name + ' ' + str(processing_time) + 's')
            print('処理時間：' + str(processing_time))
        else:
            processing_time+= q
            que.append(que_top)
            print('処理時間：' + str(processing_time))

    print('処理結果：'+ '\n　　　　　'.join(result))
    print('simulateRoundrobinCpuScheduling:end')

def main(): 
    print('main:start')
    quantum = 100
    input = [process('p1',150),process('p2',80),process('p3',200),process('p4',350),process('p5',20)]
    simulateRoundrobinCpuScheduling(input.copy(),quantum)
    print('main:end')

if __name__ == '__main__':
    main()