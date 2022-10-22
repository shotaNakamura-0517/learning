# -*- coding: utf-8 -*-
 # 2.5導入問題   
'''
ALDS_1_1_D :Maximum Profit 
    FX取引では、異なる国の通貨を交換することで為替差の利益を得ることができます。
    例えば、1ドル100円の時に1,000ドル回、為替変動により1ドル108円になった時に
    売ると、(108円-100円)×1,000ドル=8,000円の利益を得ることができます。

    ある通貨について、時刻tにおける価格R[t](t=0,1,2,...,n-1)が入力として与えられるので、
    価格の差R[j]-R[i](ただしj>1とする)の最大値を求めてください。

    入力　最初の行に整数nが与えられます。続くn行に整数R[t](t=0,1,2,...,n-1)が順番に与えられます。
    出力最大値を1行に出力してください。
'''

from stop_watch import stop_watch

@stop_watch
def getMaximumProfit (rate_list):
    '''
    Algorithm1[O(n*m)] : 3回探索する
        1.各プレイヤーの得点を配列A[10]に入力する(グローバル変数をコピー)。
        2.Aの中に含まれる10個の数から最大の値を出力する。
        3.2.で選ばれた要素を除いた9個の中から、最大値を探して出力する。
        4.3.で選ばれた要素を除いた8個の中から、最大値を探して出力する。
    '''
    print('getMaximumProfit:start')
    max = rate_list[1] - rate_list[0]
    min_rate = rate_list[0]

    for i in range(len(rate_list)-1):
        if min_rate > rate_list[i] or i==0:
            min_rate = rate_list[i]
            print("ループ実行：" + str(i) + "番目の要素：" + str(rate_list[i]))
            for j in range(i+1,len(rate_list)):
                result = rate_list[j] - rate_list[i]
                print("計算結果：" + str(rate_list[j]) + "-" + str(rate_list[i]) + "=" + str(result))
                max = result if result > max else max
    print("最大利益：" + str(max))
    print('getMaximumProfit:end')

@stop_watch
def getMaximumProfitAns (rate_list):
    print('getMaximumProfitAns:start')
    max = (10**9) * - 1 #十分に小さい値を初期値に設定
    min_rate = rate_list[0] #min_rateは売却時刻より前での最小金額

    for i in range(1,len(rate_list)):
        result = rate_list[i] - min_rate 
        print("計算結果：" + str(rate_list[i]) + "-" + str(min_rate) + "=" + str(result))
        max = result if result > max else max #i時刻での売却利益が最大の場合、最大値に設定
        min_rate = rate_list[i] if min_rate > rate_list[i] else min_rate # i時刻までの最小金額を設定
    print("最大利益：" + str(max))
    print('getMaximumProfitAns:end')



def main(): 
    print('main:start')
    rate_list = [5,3,1,3,4,3,5,3,1,3,4,3,5,3,1,3,4,3,5,3,1,3,4,3,5,3,1,3,4,3]
    #rate_list = [4,3,2]
    getMaximumProfit(rate_list)
    getMaximumProfitAns(rate_list)
    print('main:end')

if __name__ == '__main__':
    main()