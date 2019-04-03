const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const Sequelize = require('sequelize')
const config = require('./config')
const cors = require('koa2-cors');
const app = new Koa()
app.use(cors())
app.use(bodyParser())

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  }
)

router.get('/crossdomain.xml', async (ctx, next) => {
  ctx.response.type = 'text/xml'
  ctx.response.body = '<?xml version="1.0"?>' +
    '<cross-domain-policy>' +
    '<site-control permitted-cross-domain-policies="all"/>' +
    '<allow-access-from domain="*" />' +
    '</cross-domain-policy>'
})

//----------------------------------------------------User-----------------------------------------------------

var Users = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    ll: Sequelize.INTEGER(11),
    username: Sequelize.STRING(100),
    password: Sequelize.STRING(100),
  },
  {
    timestamps: true
  }
)

router.post('/insert_user', async (ctx, next) => {
  try {
    await Users.create(ctx.request.body)
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'fault' }
  }
})

router.post('/find_user', async (ctx, next) => {
  try {
    var all = await Users.findAll({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: all }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'find fault' }
  }
})
router.post('/remove_user', async (ctx, next) => {
  try {
    await Users.destroy({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'remove sucess' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'remove fault' }
  }
})
router.post('/update_user', async (ctx, next) => {
  try {
    await Users.update(ctx.request.body.update, {
      where: ctx.request.body.query
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
  }
})

//----------------------------------------------------Group-----------------------------------------------------

var Groups = sequelize.define(
  'groups',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    groupname: Sequelize.STRING(100),
    fc: Sequelize.INTEGER(11)
  },
  {
    timestamps: true
  }
)

router.post('/insert_group', async (ctx, next) => {
  try {
    var group = await Groups.create(ctx.request.body)
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: group }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'fault' }
  }
})
router.post('/find_group', async (ctx, next) => {
  try {
    var all = await Groups.findAll({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: all }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'find fault' }
  }
})
router.post('/remove_group', async (ctx, next) => {
  try {
    await Groups.destroy({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'remove sucess' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'remove fault' }
  }
})
router.post('/update_group', async (ctx, next) => {
  try {
    await Groups.update(ctx.request.body.update, {
      where: ctx.request.body.query
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
  }
})

//----------------------------------------------------GroupUser-----------------------------------------------------

var GroupUsers = sequelize.define(
  'groupusers',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    gid: Sequelize.INTEGER(11),
    uid: Sequelize.INTEGER(11),
    pid: Sequelize.INTEGER(11),
    fs: Sequelize.DOUBLE,
    ll: Sequelize.INTEGER(11),
  },
  {
    timestamps: true
  }
)

router.post('/insert_groupuser', async (ctx, next) => {
  console.log(ctx.request.body)
  try {
    await GroupUsers.create(ctx.request.body)
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'fault' }
  }
})

router.post('/find_groupuser', async (ctx, next) => {
  try {
    var all = await GroupUsers.findAll({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: all }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'find fault' }
  }
})
router.post('/remove_groupuser', async (ctx, next) => {
  try {
    await GroupUsers.destroy({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'remove sucess' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'remove fault' }
  }
})
router.post('/update_groupuser', async (ctx, next) => {
  console.log(ctx.request.body)
  try {
    await GroupUsers.update(ctx.request.body.update, {
      where: ctx.request.body.query
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
  }
})


//----------------------------------------------------Rule-----------------------------------------------------

var Rules = sequelize.define(
  'rules',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    rulename: Sequelize.STRING(100),
    gid: Sequelize.INTEGER(11),
    cc: Sequelize.INTEGER(11),
    hx: Sequelize.INTEGER(11),
    xf: Sequelize.FLOAT,
    nf: Sequelize.FLOAT,
    fd: Sequelize.FLOAT,
    tc2: Sequelize.FLOAT,
    tc1: Sequelize.FLOAT,
    tc: Sequelize.FLOAT,
    tf: Sequelize.FLOAT
  },
  {
    timestamps: true
  }
)

router.post('/insert_rule', async (ctx, next) => {
  try {
    await Rules.create(ctx.request.body)
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'fault' }
  }
})

router.post('/find_rule', async (ctx, next) => {
  try {
    var all = await Rules.findAll({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: all }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'find fault' }
  }
})
router.post('/remove_rule', async (ctx, next) => {
  try {
    await Rules.destroy({
      where: ctx.request.body
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'remove sucess' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'remove fault' }
  }
})
router.post('/update_rule', async (ctx, next) => {
  try {
    await Rules.update(ctx.request.body.update, {
      where: ctx.request.body.query
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
  }
})

router.post('/update_score', async (ctx, next) => {
  try {
    var rid = ctx.request.body.rid
    var winnerusername = ctx.request.body.winner
    var loserusername = ctx.request.body.loser
    var score = ctx.request.body.score
    var gid = ctx.request.body.gid
    var rule = await Rules.findOne({ where: { id: rid } })

    if (score >= rule.dataValues.tf) {
      // 提成分
      var tc = rule.dataValues.tc
      var tc1 = rule.dataValues.tc1
      var tc2 = rule.dataValues.tc2

      // 扣除loser分
      var loser = await Users.findOne({ where: { username: loserusername } })
      var groupLoser = await GroupUsers.findOne({ where: { gid, uid: loser.dataValues.id } })
      await GroupUsers.update(
        { fs: numSub(groupLoser.dataValues.fs, score) },
        { where: { id: groupLoser.dataValues.id } })
      // 增加winner分
      var winner = await Users.findOne({ where: { username: winnerusername } })
      var groupWinner = await GroupUsers.findOne({ where: { gid, uid: winner.dataValues.id } })
      await GroupUsers.update({ fs: numAdd(groupWinner.dataValues.fs, numSub(score, tc)) }, { where: { id: groupWinner.dataValues.id } })

      // 赢家管理抽成
      var groupWinnerParent = await GroupUsers.findOne({ where: { gid, uid: groupWinner.dataValues.pid } })
      if (groupWinnerParent) {
        if (groupWinnerParent.dataValues.ll === 1) { // 二级管理
          var groupWinnerParentParent = await GroupUsers.findOne({ where: { gid, uid: groupWinnerParent.dataValues.pid } })
          if (groupWinnerParentParent && groupWinnerParentParent.dataValues.ll == 2) { // 一级管理
            await GroupUsers.update({ fs: numAdd(groupWinnerParentParent.dataValues.fs, numSub(tc2, tc1)) },
              { where: { id: groupWinnerParentParent.dataValues.id } })
            await GroupUsers.update({ fs: numAdd(groupWinnerParent.dataValues.fs, tc1) },
              { where: { id: groupWinnerParent.dataValues.id } })
            tc = numSub(tc, tc2)
          } else {
            await GroupUsers.update({ fs: numAdd(groupWinnerParent.dataValues.fs, tc1) },
              { where: { id: groupWinnerParent.dataValues.id } })
            tc = numSub(tc, tc1)
          }
        } else if (groupWinnerParent.dataValues.ll === 2) { // 一级管理
          await GroupUsers.update({ fs: numAdd(groupWinnerParent.dataValues.fs, tc2) },
            { where: { id: groupWinnerParent.dataValues.id } })
          tc = numSub(tc, tc2)
        }
      }

      // 输家管理抽成
      var groupLoserParent = await GroupUsers.findOne({ where: { gid, uid: groupLoser.dataValues.pid } })
      if (groupLoserParent) {
        if (groupLoserParent.dataValues.ll === 1) { // 二级管理
          var groupLoserParentParent = await GroupUsers.findOne({ where: { gid, uid: groupLoserParent.dataValues.pid } })
          if (groupLoserParentParent && groupLoserParentParent.dataValues.ll == 2) { // 一级管理
            await GroupUsers.update({ fs: numAdd(groupLoserParentParent.dataValues.fs, numSub(tc2, tc1)) },
              { where: { id: groupLoserParentParent.dataValues.id } })
            await GroupUsers.update({ fs: numAdd(groupLoserParent.dataValues.fs, tc1) },
              { where: { id: groupLoserParent.dataValues.id } })
            tc = numSub(tc, tc2)
          } else {
            await GroupUsers.update({ fs: numAdd(groupLoserParent.dataValues.fs, tc1) },
              { where: { id: groupLoserParent.dataValues.id } })
            tc = numSub(tc, tc1)
          }
        } else if (groupLoserParent.dataValues.ll === 2) { // 一级管理
          await GroupUsers.update({ fs: numAdd(groupLoserParent.dataValues.fs, tc2) },
            { where: { id: groupLoserParent.dataValues.id } })
          tc = numSub(tc, tc2)
        }
      }

      // 副馆主 馆主抽成
      var level3User = await GroupUsers.findOne({ where: { gid, ll: 3 } })
      if (level3User) {
        console.log('副馆长提成', tc)
        await GroupUsers.update({ fs: numAdd(level3User.dataValues.fs, tc) }, { where: { id: level3User.dataValues.id } })
      } else {
        var level4User = await GroupUsers.findOne({ where: { gid, ll: 4 } })
        if (level4User) {
          console.log('馆长提成', tc)
          await GroupUsers.update({ fs: numAdd(level4User.dataValues.fs, tc) }, { where: { id: level4User.dataValues.id } })
        }
      }

    } else {
      // 扣除loser分
      var loser = await Users.findOne({ where: { username: loserusername } })
      var groupLoser = await GroupUsers.findOne({ where: { gid, uid: loser.dataValues.id } })
      await GroupUsers.update({ fs: groupLoser.dataValues.fs - score }, { where: { id: groupLoser.dataValues.id } })

      // 增加winner分
      var winner = await Users.findOne({ where: { username: winnerusername } })
      var groupWinner = await GroupUsers.findOne({ where: { gid, uid: winner.dataValues.id } })
      await GroupUsers.update({ fs: groupWinner.dataValues.fs + score }, { where: { id: groupWinner.dataValues.id } })
    }

    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
  }
})

function numAdd(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	return (num1 * baseNum + num2 * baseNum) / baseNum;
}

/**
 * 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * 
 * @param num1被减数  |  num2减数
 */
function numSub(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	var precision;// 精度
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

// add router middleware:
app.use(router.routes())

app.listen(3008)
console.log('app started at port 3008...')
