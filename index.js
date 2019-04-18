const Koa = require('koa')
const Sequelize = require('sequelize')
const config = require('./config')
const cors = require('koa2-cors');
const koaBody = require('koa-body')
const Router = require('koa-router');
const router = new Router();
const fs = require('fs')
const path = require('path')
const app = new Koa()
const uuidv1 = require('uuid/v1')
const send = require('koa-send');
const moment = require('moment');

app.use(cors())
app.use(koaBody({ multipart: true }));
app.use(router.routes()).use(router.allowedMethods());

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

router.get('/version_update', async (ctx, next) => {
  ctx.response.type = 'json'
  ctx.response.body = { code: 0, vn: '1.0.8', ul: 'https://fir.im/niuniu1' }
})

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
    fc: Sequelize.INTEGER(11),
    qd: Sequelize.STRING(100),
    jb: Sequelize.INTEGER(11)
  },
  {
    timestamps: true
  }
)

router.post('/login', async (ctx, next) => {
  // body {un pwd vn}
  try {
    if (ctx.request.body.vn != '1.0.8') {
      ctx.response.type = 'json'
      ctx.response.body = { code: -2, data: '登录失败，请升级到最新版本V1.0.8\r NewGold' }
    } else {
      var all = await Users.findAll({
        where: {
          username: ctx.request.body.un,
          password: ctx.request.body.pwd
        }
      })
      if (all && all.length > 0) {
        // ss: "106.14.148.139",
        ctx.response.type = 'json'
        ctx.response.body = {
          code: 0,
          us: all,
          ss: "139.9.72.162",
          hs: 'http://hefeixiaomu.com:3008/'
        }
      } else {
        ctx.response.type = 'json'
        ctx.response.body = {
          code: -2,
          data: '用户名密码错误'
        }
      }
    }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'find fault' }
  }
})
router.post('/insert_user', async (ctx, next) => {
  try {
    if (ctx.request.body.username == "" || ctx.request.body.password == "") {
      ctx.response.type = 'json'
      ctx.response.body = { code: -2, data: '用户名/密码不能为空' }
      return
    }
    var all = await Users.findAll({
      where: {
        username: ctx.request.body.username
      }
    })
    if (all && all.length > 0) {
      ctx.response.type = 'json'
      ctx.response.body = { code: -2, data: '注册失败 该玩家已经存在' }
    } else {
      await Users.create(ctx.request.body)
      ctx.response.type = 'json'
      ctx.response.body = { code: 0, data: 'success' }
    }
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
router.post('/find_user2', async (ctx, next) => {
  try {
    var all = await Users.findAll(ctx.request.body)
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
    ss: Sequelize.STRING(100)
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
    nn: Sequelize.STRING(100),
    pid: Sequelize.INTEGER(11),
    fs: Sequelize.DOUBLE,
    ll: Sequelize.INTEGER(11),
    tc: Sequelize.FLOAT
  },
  {
    timestamps: true
  }
)

router.post('/insert_groupuser', async (ctx, next) => {
  console.log(ctx.request.body)
  try {
    var all = await GroupUsers.findAll({
      where: {
        gid: ctx.request.body.gid,
        uid: ctx.request.body.uid
      }
    })
    if (all && all.length > 0) {
      ctx.response.type = 'json'
      ctx.response.body = { code: -2, data: '添加群成员失败 该成员已经在群里' }
    } else {
      await GroupUsers.create(ctx.request.body)
      ctx.response.type = 'json'
      ctx.response.body = { code: 0, data: 'success' }
    }
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
router.post('/update_gus', async (ctx, next) => {
  console.log(ctx.request.body)
  // {gid tid fid ss, tn, fn}
  try {
    var aid = 0, rid = 0, afs = 0, rfs = 0
    var gid = ctx.request.body.gid
    var tn = ctx.request.body.tn
    var tid = ctx.request.body.tid
    var fn = ctx.request.body.fn
    var fid = ctx.request.body.fid
    var ss = ctx.request.body.ss

    var adder = await GroupUsers.findOne({ where: { gid: ctx.request.body.gid, uid: tid } })
    if (adder) {
      aid = adder.dataValues.id
      afs = numAdd(adder.dataValues.fs, ss)
    }
    var remover = await GroupUsers.findOne({ where: { gid: ctx.request.body.gid, uid: fid } })
    if (remover) {
      rid = remover.dataValues.id
      rfs = numSub(remover.dataValues.fs, ss)
    }

    console.log('============================add_score============================')
    console.log('aid', aid)
    console.log('afs', afs)
    console.log('rid', rid)
    console.log('rfs', rfs)
    console.log('============================add_score============================')

    if (aid > 0 && rid > 0) {
      await GroupUsers.update({ fs: afs }, { where: { id: aid } })
      await GroupUsers.update({ fs: rfs }, { where: { id: rid } })

      await Fight.create({
        gid,
        rn: '增加减少疲劳值',
        run: '增加减少疲劳值',
        wn: tn,
        wid: tid,
        wfs: ss,
        wtfs: afs,
        ln: fn,
        lfs: -ss,
        lid: fid,
        ltfs: rfs
      })

      ctx.response.type = 'json'
      ctx.response.body = { code: 0, data: 'update success' }
    } else {
      ctx.response.type = 'json'
      ctx.response.body = { code: -1, data: 'update fault' }
    }
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
    tf: Sequelize.FLOAT,
    plz: Sequelize.INTEGER(11),
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

//----------------------------------------------------applyrecord-----------------------------------------------------

var Applyrecord = sequelize.define(
  'applyrecord',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    uid: Sequelize.INTEGER(11),
    gid: Sequelize.INTEGER(11),
    finish: Sequelize.STRING(1),
    result: Sequelize.STRING(1),
  },
  {
    timestamps: true
  }
)

router.post('/insert_applyrecord', async (ctx, next) => {
  try {
    await Applyrecord.create(ctx.request.body)
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'fault' }
  }
})

router.post('/find_applyrecord', async (ctx, next) => {
  try {
    var all = await Applyrecord.findAll({
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
router.post('/remove_applyrecord', async (ctx, next) => {
  try {
    await Applyrecord.destroy({
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
router.post('/update_applyrecord', async (ctx, next) => {
  try {
    await Applyrecord.update(ctx.request.body.update, {
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


//----------------------------------------------------更新战绩-----------------------------------------------------

router.post('/update_score', async (ctx, next) => {
  console.log('update_score...', ctx.request.body)
  try {
    var rid = ctx.request.body.rid
    var rule = await Rules.findOne({ where: { id: rid } })
    var tc0 = rule.dataValues.tc
    var tc1 = rule.dataValues.tc1
    var tc2 = rule.dataValues.tc2

    var gid = ctx.request.body.gid
    var rn = ctx.request.body.rn
    var run = rule.rulename
    var wn = ctx.request.body.winner
    var wid = 0
    var wfs = ctx.request.body.score
    var wtfs = 0
    var ln = ctx.request.body.loser
    var lid = 0
    var lfs = -wfs
    var ltfs = 0

    var w1id = 0
    var w1tc = 0
    var w1tfs = 0

    var w2id = 0
    var w2tc = 0
    var w2tfs = 0

    var l1id = 0
    var l1tc = 0
    var l1tfs = 0

    var l2id = 0
    var l2tc = 0
    var l2tfs = 0

    var tc = rule.dataValues.tc
    var zid = 0
    var ztc = 0
    var ztfs = 0

    var groupLoser
    var groupLoser2
    var groupLoser1
    var groupWinner
    var groupWinner2
    var groupWinner1

    if (wfs >= rule.dataValues.tf) {
      var loser = await Users.findOne({ where: { username: ln } })
      if (loser) {
        var lid = loser.dataValues.id
        groupLoser = await GroupUsers.findOne({ where: { gid, uid: lid } })
        if (groupLoser) {
          ltfs = numSub(groupLoser.dataValues.fs, wfs)
        }
      }

      var winner = await Users.findOne({ where: { username: wn } })
      if (winner) {
        wid = winner.dataValues.id
        groupWinner = await GroupUsers.findOne({ where: { gid, uid: wid } })
        if (groupWinner) {
          wfs = numSub(wfs, tc)
          wtfs = numAdd(groupWinner.dataValues.fs, wfs)
        }
      }

      // 更新分数
      if (lid > 0 && wid > 0) {
        await GroupUsers.update({ fs: ltfs }, { where: { gid: gid, uid: lid } })
        await GroupUsers.update({ fs: wtfs }, { where: { gid: gid, uid: wid } })
      }
      else {
        ctx.response.type = 'json'
        ctx.response.body = { code: -2, data: 'update fault can not found loser or winner' }
        return
      }

      if (groupWinner) {
        var groupWinnerParent = await GroupUsers.findOne({ where: { gid, uid: groupWinner.dataValues.pid } })
        if (groupWinnerParent) {
          if (groupWinnerParent.dataValues.ll === 1) {
            groupWinner2 = groupWinnerParent // 赢家2级管理员

            var groupWinnerParentParent = await GroupUsers.findOne({ where: { gid, uid: groupWinner2.dataValues.pid } })
            if (groupWinnerParentParent && groupWinnerParentParent.dataValues.ll == 2) {
              groupWinner1 = groupWinnerParentParent // 赢家1级管理员
              w1id = groupWinner1.dataValues.uid
              w1tc = numSub(tc2, tc1)
              w1tfs = numAdd(groupWinner1.dataValues.fs, w1tc)
              w2id = groupWinner2.dataValues.uid
              w2tc = tc1
              w2tfs = numAdd(groupWinner2.dataValues.fs, w2tc)
              tc = numSub(tc, tc2)

              // 更新分数
              if (w1id > 0) { await GroupUsers.update({ fs: w1tfs }, { where: { gid: gid, uid: w1id } }) }
              if (w2id > 0) { await GroupUsers.update({ fs: w2tfs }, { where: { gid: gid, uid: w2id } }) }
            } else {
              w2id = groupWinner2.dataValues.uid
              w2tc = tc1
              w2tfs = numAdd(groupWinner2.dataValues.fs, w2tc)
              tc = numSub(tc, tc1)

              // 更新分数
              if (w2id > 0) { await GroupUsers.update({ fs: w2tfs }, { where: { gid: gid, uid: w2id } }) }
            }
          } else if (groupWinnerParent.dataValues.ll === 2) {
            groupWinner1 = groupWinnerParent // 赢家1级管理员
            w1id = groupWinner1.dataValues.uid
            w1tc = tc2
            w1tfs = numAdd(groupWinner1.dataValues.fs, w1tc)
            tc = numSub(tc, tc2)

            // 更新分数
            if (w1id > 0) { await GroupUsers.update({ fs: w1tfs }, { where: { gid: gid, uid: w1id } }) }
          }
        }
      }

      // 输家管理抽成
      if (groupLoser) {
        var groupLoserParent = await GroupUsers.findOne({ where: { gid, uid: groupLoser.dataValues.pid } })
        if (groupLoserParent) {
          if (groupLoserParent.dataValues.ll === 1) {
            groupLoser2 = groupLoserParent // 二级管理员
            var groupLoserParentParent = await GroupUsers.findOne({ where: { gid, uid: groupLoser2.dataValues.pid } })
            if (groupLoserParentParent && groupLoserParentParent.dataValues.ll == 2) {
              groupLoser1 = groupLoserParentParent // 一级管理员
              l1id = groupLoser1.dataValues.uid
              l1tc = numSub(tc2, tc1)
              l1tfs = numAdd(groupLoser1.dataValues.fs, l1tc)
              l2id = groupLoser2.dataValues.uid
              l2tc = tc1
              l2tfs = numAdd(groupLoser2.dataValues.fs, l2tc)
              tc = numSub(tc, tc2)

              // 更新分数
              if (l1id > 0) { await GroupUsers.update({ fs: l1tfs }, { where: { gid: gid, uid: l1id } }) }
              if (l2id > 0) { await GroupUsers.update({ fs: l2tfs }, { where: { gid: gid, uid: l2id } }) }
            } else {
              l2id = groupLoser2.dataValues.uid
              l2tc = tc1
              l2tfs = numAdd(groupLoser2.dataValues.fs, l2tc)
              tc = numSub(tc, tc1)

              // 更新分数
              if (l2id > 0) { await GroupUsers.update({ fs: l2tfs }, { where: { gid: gid, uid: l2id } }) }
            }
          } else if (groupLoserParent.dataValues.ll === 2) {
            groupLoser1 = groupLoserParent // 赢家1级管理员
            l1id = groupLoser1.dataValues.uid
            l1tc = tc2
            l1tfs = numAdd(groupLoser1.dataValues.fs, l1tc)
            tc = numSub(tc, tc2)

            // 更新分数
            if (l1id > 0) { await GroupUsers.update({ fs: l1tfs }, { where: { gid: gid, uid: l1id } }) }
          }
        }
      }

      // 副馆主 馆主抽成
      var level3User = await GroupUsers.findOne({ where: { gid, ll: 3 } })
      if (level3User) {
        zid = level3User.dataValues.uid
        ztc = tc
        ztfs = numAdd(level3User.dataValues.fs, tc)
      } else {
        var level4User = await GroupUsers.findOne({ where: { gid, ll: 4 } })
        if (level4User) {
          zid = level4User.dataValues.uid
          ztc = tc
          ztfs = numAdd(level4User.dataValues.fs, tc)
        }
      }

      // 更新分数
      if (zid > 0) { await GroupUsers.update({ fs: ztfs }, { where: { gid: gid, uid: zid } }) }

    } else {
      // 积分小于提成分数 
      var loser = await Users.findOne({ where: { username: ln } })
      if (loser) {
        var lid = loser.dataValues.id
        groupLoser = await GroupUsers.findOne({ where: { gid, uid: lid } })
        if (groupLoser) {
          ltfs = numSub(groupLoser.dataValues.fs, wfs)
        }
      }
      var winner = await Users.findOne({ where: { username: wn } })
      if (winner) {
        wid = winner.dataValues.id
        groupWinner = await GroupUsers.findOne({ where: { gid, uid: wid } })
        if (groupWinner) {
          wtfs = numAdd(groupWinner.dataValues.fs, wfs)
        }
      }

      // 更新分数
      if (lid > 0 && wid > 0) {
        await GroupUsers.update({ fs: ltfs }, { where: { gid: gid, uid: lid } })
        await GroupUsers.update({ fs: wtfs }, { where: { gid: gid, uid: wid } })
      }
      else {
        ctx.response.type = 'json'
        ctx.response.body = { code: -2, data: 'update fault can not found loser or winner' }
        return
      }
    }

    console.log('============================update_score============================')
    console.log('群ID', gid)
    console.log('房间名称', rn)
    console.log('规则名称', run)
    console.log('赢家ID', wid)
    console.log('赢家名称', wn)
    console.log('赢的分数', wfs)
    console.log('赢后分数', wtfs)
    console.log('输家ID', lid)
    console.log('输家名称', ln)
    console.log('输的分数', lfs)
    console.log('输后分数', ltfs)
    console.log('赢家二级ID', w2id)
    console.log('赢家二级提成', w2tc)
    console.log('赢家二级分数', w2tfs)
    console.log('赢家一级ID', w1id)
    console.log('赢家一级提成', w1tc)
    console.log('赢家一级分数', w1tfs)
    console.log('输家二级ID', l2id)
    console.log('输家二级提成', l2tc)
    console.log('输家二级分数', l2tfs)
    console.log('输家一级ID', l1id)
    console.log('输家一级提成', l1tc)
    console.log('输家一级分数', l1tfs)
    console.log('馆长ID', zid)
    console.log('馆长提成', ztc)
    console.log('馆长分数', ztfs)
    console.log('============================update_score============================')

    if (wid > 0 && lid > 0) {
      await Fight.create({
        gid, rn, run, tc: tc0,
        wid, wn, wfs, wtfs,
        lid, ln, lfs, ltfs,
        w2id, w2tc, w2tfs,
        w1id, w1tc, w1tfs,
        l1id, l1tc, l1tfs,
        l2id, l2tc, l2tfs,
        zid, ztc, ztfs
      })
    }

    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
    console.log('update score success')
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
    console.log('update score fault')
  }
})

//----------------------------------------------------更新金币-----------------------------------------------------

router.post('/update_gold', async (ctx, next) => {
  console.log('update_gold...', ctx.request.body)
  try {
    var wn = ctx.request.body.winner
    var ln = ctx.request.body.loser
    var score = ctx.request.body.score
    var loser = await Users.findOne({ where: { username: ln } })
    if (loser) {
      await Users.update({ jb: numSub(loser.dataValues.jb, score) }, {
        where: { id: loser.dataValues.id }
      })
      var winner = await Users.findOne({ where: { username: wn } })
      if (winner) {
        await Users.update({ jb: numAdd(winner.dataValues.jb, score) }, {
          where: { id: winner.dataValues.id }
        })
      }
    }

    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'update success' }
    console.log('update gold success')
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'update fault' }
    console.log('update gold fault')
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


//----------------------------------------------------Fights-----------------------------------------------------

var Fight = sequelize.define(
  'fights',
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      autoIncrement: true
    },
    rn: Sequelize.STRING(100),
    run: Sequelize.STRING(100),
    gid: Sequelize.INTEGER(11),
    wn: Sequelize.STRING(100),
    wid: Sequelize.INTEGER(11),
    wfs: Sequelize.DOUBLE,
    wtfs: Sequelize.DOUBLE,
    ln: Sequelize.STRING(100),
    lid: Sequelize.INTEGER(11),
    lfs: Sequelize.DOUBLE,
    ltfs: Sequelize.DOUBLE,
    w2id: Sequelize.INTEGER(11),
    w1id: Sequelize.INTEGER(11),
    w1tc: Sequelize.DOUBLE,
    w2tc: Sequelize.DOUBLE,
    w2tfs: Sequelize.DOUBLE,
    w1tfs: Sequelize.DOUBLE,
    l2id: Sequelize.INTEGER(11),
    l1id: Sequelize.INTEGER(11),
    l1tc: Sequelize.DOUBLE,
    l2tc: Sequelize.DOUBLE,
    l1tfs: Sequelize.DOUBLE,
    l2tfs: Sequelize.DOUBLE,
    tc: Sequelize.DOUBLE,
    zid: Sequelize.STRING(100),
    ztc: Sequelize.DOUBLE,
    ztfs: Sequelize.DOUBLE,
  },
  {
    timestamps: true
  }
)

router.post('/find_fight', async (ctx, next) => {
  try {
    var all = await Fight.findAll({
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


router.post('/upload_audio', async (ctx, next) => {
  // 上传单个文件
  console.log('upload audio')
  const file = ctx.request.files.audio; // 获取上传文件
  const reader = fs.createReadStream(file.path)
  const uuid = uuidv1()
  let filePath = path.join(__dirname, 'public/upload/audios/') + `/${uuid}.wav`;
  // // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // // 可读流通过管道写入可写流
  reader.pipe(upStream);
  ctx.response.type = 'json'
  ctx.response.body = { code: 0, data: uuid }
})

router.post('/get_audio', async (ctx) => {
  console.log('get audio')
  const uuid = ctx.request.body.uuid
  let filePath = path.join('public/upload/audios/') + `/${uuid}.wav`;
  ctx.attachment(filePath)
  await send(ctx, filePath)
})

router.post('/get_check_in', async (ctx) => {
  let formatDate = moment(new Date()).format('YYYY-MM-DD'); /*格式化时间*/
  // console.log('formatDate:',formatDate)/*2019-04-17*/
  try {
    let allUsers = await Users.findAll({
      where: ctx.request.body.query
    })
    if (allUsers[0].qd == formatDate) {
      ctx.response.type = 'json'
      ctx.response.body = { code: -1, data: 'check_in repeat' }/*重复签到*/
      return
    }
    await Users.update({ qd: formatDate }, {
      where: ctx.request.body.query
    })
    ctx.response.type = 'json'
    ctx.response.body = { code: 0, data: 'check_in success' }
  } catch (error) {
    console.log(error)
    ctx.response.type = 'json'
    ctx.response.body = { code: -1, data: 'check_in fault' }
  }
})

app.listen(3008)
console.log('app started at port 3008...')
