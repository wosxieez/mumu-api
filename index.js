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

// add router middleware:
app.use(router.routes())

app.listen(3008)
console.log('app started at port 3008...')
