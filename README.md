# weiso简易招聘网站

### 接口文档
#### creatNewAccount(创建新的账户)
需要的参数
userType、accountInfo(包含loginNumber, passWord, secretQuestion, secretAnswer, province, city, userType, companyName)

#### signIn(登录的接口)
需要的参数
userType ,accountInfo(包含loginNumber, passWord)

#### creatNewJob(创建新的职位)
需要的参数
userType ,userID, jobData(包含jobName, jobDesc, jobType, education, provinces, city, address, companyName)

#### user(用户信息)
需要的参数
userType ,userID
