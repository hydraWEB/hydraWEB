import os
from itertools import islice
import copy
import string 
import csv
import math
import numpy

def decdeg2dms(dd):
    is_positive = dd >= 0
    dd = abs(dd)
    minutes,seconds = divmod(dd*3600,60)
    degrees,minutes = divmod(minutes,60)
    degrees = degrees if is_positive else -degrees
    
    d = round(degrees, 0)
    m = round(minutes, 0)
    s = round(seconds, 5)
    d = int(d)
    d = str(d)
    m = int(m)
    m = str(m)
    s = str(s)
    dms=d+m+s
    
    return dms
def XYZTOGEODETIC(x,y,z):
    a = 6378137.0 #in meters
    b = 6356752.314245 #in meters

    f = (a - b) / a
    f_inv = 1.0 / f

    e_sq = f * (2 - f)                       
    eps = e_sq / (1.0 - e_sq)

    p = math.sqrt(x * x + y * y)
    q = math.atan2((z * a), (p * b))

    sin_q = math.sin(q)
    cos_q = math.cos(q)

    sin_q_3 = sin_q * sin_q * sin_q
    cos_q_3 = cos_q * cos_q * cos_q

    phi = math.atan2((z + eps * b * sin_q_3), (p - e_sq * a * cos_q_3))
    lam = math.atan2(y, x)

    v = a / math.sqrt(1.0 - e_sq * math.sin(phi) * math.sin(phi))
    high = (p / math.cos(phi)) - v

    latitude = math.degrees(phi)
    longitude= math.degrees(lam)
        
    # 取到小數點後四位
    
    lat = round(latitude, 8)
    lon = round(longitude,8)
    h   = round(high, 4)
    h = str(h)
    
    #需要將經緯度從 DD(十進位) 轉換為 DMS(度分秒) 
    #lat = decdeg2dms(lat)
    #lon = decdeg2dms(lon)
    
    return lat, lon, h
def GnsscrdToCsv():
    file=[]
    file_name=[]
    cmd="find /root/GPSDATA/CAMPAIGN52/MOST/STA -name '*.CRD' -mmin -30"
    result=os.popen(cmd).read()

    temp=""
    for i in range(0,len(result)):
        if result[i]!="\n":
            temp=temp+str(result[i])
        else:
            file.append(temp)
            temp=""

    for i in range(0,len(file)):
        temp=file[i].replace("/root/GPSDATA/CAMPAIGN52/MOST/STA/","")
        file_name.append(temp)
    path="/root/GPSDATA/CAMPAIGN52/MOST/STA/"
    path1="/root/GNSS_Search_Data/CRD_TO_CSV/"
    for i in range(0,len(file_name)):
        with open(path+file_name[i],'r')as f:
            rows = f.readlines()
            sum=0
            header=["NUM","STATION","NAME","Lat(度)","Lon(度)","h(m)","FLAG"]
            with open(path1+file_name[i].replace('CRD','csv'),'w')as out:
                writer = csv.writer(out)
                writer.writerow(header)
                for row in islice(rows, 6, None): #從第一筆資料(6)開始
                    list1 =[]
                    s=""
                
                    # txt 尾段有空白行，靠此來 break 掉
                    if(len(row)==1):
                        print("end of file")
                        break

                    #將每筆資料的值存到 list 內
                    for i in row:
                        if(i != ' ' and i != '\n'):
                            s+=i
                        if(i ==' '):
                            list1.append(s)
                            s=""
                    list1.append(s) # z 後面沒有空格，所以需要額外 append 到 list 內
                
                    list1 = [x.strip() for x in list1 if x.strip()!=''] #清掉 list 的空值
                
                    # 檔案內有兩行含 PPP 數值，避免干擾換算，先 pop 掉
                        
                    try:
                        float(list1[-1])
                        list1.append("")
                    except:
                        a=1
                
                    # 增加空格，讓輸入函式的 x,y,z 可以在 list 的位置是固定的
                    if(len(list1)<7):
                        list1.insert(2,'')
                    # string 轉 float 
                    x=float(list1[3])
                    y=float(list1[4])
                    z=float(list1[5])
                    
            
                    # 轉換完的 x,y,z 取代 list 3後面的值
                    list1[3:6] = XYZTOGEODETIC(x,y,z)
                    writer.writerow(list1)
                    sum+=1
            
                    #print("list = ",list1)
                #print("總筆數 = ",sum)