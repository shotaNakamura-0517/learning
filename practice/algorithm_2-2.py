# -*- coding: utf-8 -*-
 # 2.2問題とアルゴリズムの例   
'''
問題 : Top3
    10人分のプレイヤーの得点が記録されたデータを読み込んで、
    その中から上位3人の得点を順に出力してください。ただし、得点は100点満点とします。
'''

score_list = [25,36,4,55,71,18,0,71,89,65]

def algorithm1(copy_list,n):
    '''
    Algorithm1[O(n*m)] : 3回探索する
        1.各プレイヤーの得点を配列A[10]に入力する(グローバル変数をコピー)。
        2.Aの中に含まれる10個の数から最大の値を出力する。
        3.2.で選ばれた要素を除いた9個の中から、最大値を探して出力する。
        4.3.で選ばれた要素を除いた8個の中から、最大値を探して出力する。
    '''
    print('algorithm1:start')
    max_list = []
    tmp_list = list(copy_list)
    for i in range(n):
         max = 0
         max_number = 0
         for j in range(len(tmp_list)):
            if max < tmp_list[j]:
                max = tmp_list[j]
                max_number = j
         max_list.append(tmp_list.pop(max_number)) 
    print(max_list)
    print('algorithm1:end')

def algorithm2(copy_list,n):
    '''
    Algorithm2[O(mlogm+n)] : 3回探索する
        1.各プレイヤーの得点を配列A[10]に入力する(グローバル変数をコピー)。
        2.Aを降順に整列する
        3.Aの最初の3つの要素を出力する
    '''
    print('algorithm2:start')
    tmp_list = sorted(list(copy_list), reverse = True)
    print(tmp_list[0:n])
    print('algorithm2:end')

def algorithm3(copy_list,n,x):
    '''
    Algorithm3[O(n+m+max(a[i]))] : 3回探索する
        1.得点pを獲得した人数を配列C[p]に記録する。
        2.C[100],C[99]...、の順にC[p]が1以上の場合pをC[p]回出力する（ただし合計3回まで）
    '''
    print('algorithm3:start')
    max_list = []
    count = 0
    score_count_list = [0] * ((10 ** x) + 1) #10の累乗(配列の最大値の桁数 + 1) + 1
    score_count_list_reverse_elm = len(score_count_list) - 1 #配列の逆順の要素番号の計算用
    tmp_list = list(copy_list)
    for i in range(len(score_count_list)):
         for j in range(len(tmp_list)):
            if i == tmp_list[j]:
                score_count_list[i] = score_count_list[i] + 1
    score_count_list.reverse()
    for k in range(len(score_count_list)):
        if score_count_list[k] > 0:
            for l in range(score_count_list[k]):
                max_list.append(score_count_list_reverse_elm - k)
                count = count + 1
                if count == n:
                    break
        if count == n:
            break     
    print(max_list)
    print('algorithm3:end')

def main(): 
    print('main:start')
    algorithm1(score_list,3)
    algorithm2(score_list,3)
    degit = len(str(max(score_list))) #algorithm3の配列の要素数決定用
    algorithm3(score_list,3,degit)
    print(score_list)
    print('main:end')

if __name__ == '__main__':
    main()