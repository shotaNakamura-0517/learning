from functools import wraps
import time

#https://qiita.com/hisatoshi/items/7354c76a4412dffc4fd7
def stop_watch(func) :
    @wraps(func)
    def wrapper(*args, **kargs) :
        start = time.time()
        result = func(*args,**kargs)
        process_time =  time.time() - start
        print(f"{func.__name__}は{process_time}秒かかりました")
        return result
    return wrapper