<template>
	<div class="login_container">
		<div class="login_box">
			<!--头像 --> 
			<div class="avantar_box">
				<img src="../assets/logo.png">
			</div>
			<el-form  ref="loginFormRef" label-width="0px" class="login_form" v-bind:model="loginForm" :rules="loginRules">
			  <el-form-item prop="username">
			    <el-input prefix-icon="el-icon-search" v-model="loginForm.username" ></el-input>
			  </el-form-item>
			  <el-form-item prop="password">
			    <el-input type="password" v-model="loginForm.password"></el-input>
			  </el-form-item>
			  <el-form-item class="btns">
			    <el-button type="primary" @click="login">登录</el-button>
				<el-button @click="resetLoginForm" type="info">重置</el-button>
			  </el-form-item>
			</el-form>
			
		</div>
	</div>
	
</template>

<script>
	export default{
		name:'Login',
		data(){
			return {
				loginForm:{
					username:'admin',
					password:'123456'
				},
				loginRules:{
					username:[
						{required :true,message:"请输入登录名称",trigger:"blur"},
						{min:3,max:5,message:"长度在3到5",trigger:"blur"}
					],
					password:[
						{min:3,max:11,message:"长度在3到5",trigger:"blur"}
					]
				}
			}
		},
		methods:{
			resetLoginForm(){
				//this.loginForm.username = this.loginForm.password = ''
				//this指向组件本身，$ref中有所有通过ref注册的元素或子组件，resetFields是element ui
				this.$refs.loginFormRef.resetFields()
			},
			login(){
				this.$refs.loginFormRef.validate(async valid=>{
					if(!valid) return;
					//配置Axios
					//解构
					let {data:res} = await this.$axios.post('login',this.loginForm)
                 
					if(res.meta.status !== 200) return this.$el_message.error(res.meta.msg)
					this.$el_message.success('登录成功！')
					//保存服务器返回的token到sessionStorage中，其他API接口都必须登录后访问
					window.sessionStorage.setItem('token',res.data.token)
					console.log(this)
					console.log(this.$router.push('/home'))
				})
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_container{
		background-color: #2b4b6b;
		height:100%;
	}
	.login_box{
		width:450px;
		height:300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		left:50%;
		top:50%;
		transform:translate(-50%,-50%)
		
	}
	.avantar_box{
		height:130px;
		width:130px;
		border:solid 1px #eee;
		border-radius: 50%;
		padding:10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left:50%;
		transform:translate(-50%,-50%);
		background-color: #fff;
		img{
			height:100%;
			width:100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}
	.btns{
		display:flex;
		justify-content: flex-end;
		padding: 5px;
	}
	.login_form{
		position: absolute;
		bottom:0;
		width:100%;
		padding:0 20px;
		box-sizing: border-box;
		
	}
</style>

