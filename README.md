# hitszplaza
## 使用说明
### 数据库说明
#### MongoDB数据库
课表部分使用`MongoDB`数据库，其中数据库url为http://121.4.40.110:27017，名称为'hitszplaza'，集合名为'STU_INFO'.
MongoDB的安装在此略去，在设置db、log等路径及环境变量后，进入MongoDB的bin目录下，键入命令`./mongod --config mongodb.conf`以启用服务端，接下来键入命令'./mongo'以启用客户端，下面是常用操作：
- `show dbs`查看当前数据库列表。
- `use $dbName$`使用该数据库。
- `show collections`查看当前数据库下的所有集合。
- `db.printCollectionStats()`查看当前数据库下所有集合状态。
- `db.repairDatabase()`修复数据库
- `db.copyDatabase(‘oringinCollection’,’newCollection’)`复制数据库
- `db.dropDatabase()`删库
- `db.collectionName.drop()`删除集合
建议使用Robo 3T等可视化工具管理数据库，其安装与使用可以参考：[MongoDB可视化工具--Robo 3T 安装使用教程](https://my.oschina.net/u/4314526/blog/4066189/)
注意：我们的数据库无密码设置，Authentication部分可以略过。
## 开发说明
### 更新代码至服务器
首先将代码推送至Gitee，步骤为Add -> Commit -> Push，然后在服务器端拉取代码。
这是一种可行的方法，但效率略低，对于JetBrains用户，可以参考该链接自动同步本地代码与远端代码：[PyCharm 如何远程连接服务器编写程序](https://www.cnblogs.com/wcwnina/p/10016363.html)
> 请在`Commit`阶段将修改位置和内容尽量写清，如果发生两种以上的修改，应根据功能分批次Commit不同的文件。
### 在服务器端管理代码
1. 使用`git add $FileName$`更新需要提交的文件，也可使用`git add -A`一次提交所有文件。
2. 使用`git commit -a`提交文件。
3. 使用`git push`命令将代码推送至Gitee.
4. 若发生合并冲突，使用`git pull`命令先将更新的Gitee仓库文件拉取下来，再更新合并的Commit，最后通过push命令推送。

