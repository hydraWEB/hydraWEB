import os
from itertools import islice
import copy
import string 
import csv
import math
import numpy
from datetime import datetime
def RecordUploadFile(username, filename, filepath, counter):
    header=['file_path','file_name','username','last_download','last_created','download_count']
    dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    file_dir = os.path.join(dir_path,"file_record.csv")
    if(os.path.isfile(file_dir)):
        if counter==0:
            with open(file_dir, 'a',encoding="utf8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        elif counter==1:
            file = []
            with open(file_dir, "r", newline='', encoding="UTF-8") as csvfile:
                csvReader = csv.DictReader(csvfile) 
                for row in csvReader:
                   #add this python dict to json array
                   file.append(row)
            os.remove(file_dir)
            download_count=0
            with open(file_dir, 'w+',encoding="utf8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                for record in file:
                    if str(record['file_name'])!=str(filename):
                        writer.writerow([record['file_path'],record['file_name'],record['username'],record['last_download'],record['last_created'],record['download_count']])
                        print(record)
                    else:
                        download_count=int(record['download_count'])
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), download_count])
                
    else:
        with open(file_dir, 'w+',encoding="utf8") as out_file:
            writer = csv.writer(out_file)
            writer.writerow(header)
            writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
            out_file.close()
            
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
def GnsscrdToCsv(username):
    file=[]
    file_name=[]
    cmd="find /root/GPSDATA/CAMPAIGN52/MOST/STA -name 'PPP2*.CRD'"
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
    path1="/root/platform_gnss_csv/"
    path1=path1+str(username)
    path1=path1+"/"
    upload_path="/var/www/html/app-deploy/HydraWeb/server/upload_data/"
    upload_path=upload_path+str(username)
    u_path=upload_path
    upload_path=upload_path+"/"
    if os.path.isdir(path1)==False:
        os.mkdir(path1)
    if os.path.isdir(upload_path)==False:
        os.mkdir(upload_path)
    for i in range(0,len(file_name)):
        utemp=path
        utemp=utemp+str(file_name[i])
        upload_path1=upload_path
        upload_path1=upload_path1+str(file_name[i])
        counter=0
        if os.path.isfile(upload_path1)==True:
            os.remove(upload_path1)
            counter=1
        cmd = "cp {} {}".format(str(utemp),str(upload_path))
        os.system(cmd)
        RecordUploadFile(username, file_name[i], u_path, counter)
        with open(path+file_name[i],'r')as f:
            rows = f.readlines()
            sum=0
            header=["NUM","STATION","NAME","Lat(度)","Lon(度)","h(m)","FLAG","Time"]
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
                    list1[3:6] = XYZTOGEODETIC(x,y,z)
                    if list1[-1]==str("PPP"):
                        for row in islice(rows, 2, None): # 抓時間段
                            # 刪除\n
                            row = row[:-1]
            
                            #日期轉換 2021-01-01 11:59:45 to 2021-01-01T11:59:45Z
                            row = row.replace("LOCAL GEODETIC DATUM: IGS14             EPOCH: ","")
                            t=row
                            temp1 = datetime.strptime(t, "%Y-%m-%d %H:%M:%S")
                            temp2 = datetime.strftime(temp1, '%Y-%m-%dT%H:%M:%SZ')
                            list1.append(temp2)
                            break
                        writer.writerow(list1)
                    sum+=1
            
                    #print("list = ",list1)
                #print("總筆數 = ",sum)