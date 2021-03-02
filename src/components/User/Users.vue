<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			
			  <el-row :gutter="20">
				  <el-col :span="8">
					  <el-input placeholder="请输入内容"  v-model="queryInfo.query" :clearable="true" @clear="getUserList">
					     
					      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					    </el-input>
				  </el-col>
				  <el-col :span="4">
					  <el-button @click="addDialogVisible=true">添加用户</el-button>
				  </el-col>
			  </el-row>
			  <el-row>
				  <el-table border stripe
				        :data="userlist"
				        style="width: 100%">
						<el-table-column
						  type="index">
						</el-table-column>
						
				        <el-table-column
				          prop="create_time"
				          label="创建日期"
				          >
				        </el-table-column>
				        
				        <el-table-column
				          prop="username"
				          label="用户名"
						  >
				        </el-table-column>
						<el-table-column
						  prop="mobile"
						  label="联系方式">
						</el-table-column>
						<el-table-column
						  prop="role_name"
						  label="角色"
						  >
						</el-table-column>
						<el-table-column
						  prop="email"
						  label="邮箱"
						 >
						</el-table-column>
						<el-table-column
						  
						  label="状态"
						  >
						  <template v-slot:default="scope"> <!-- 子组件绑定的值是row，可以通过自定义props取到-->
							   <!--作用域插槽-->
							  <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)">
							  </el-switch>
						  </template>
						</el-table-column>
						<el-table-column
						  width="180"
						  label="操作"
						  >
						  <template v-slot:default="scope">
							  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInformation(scope.row)"></el-button>
							  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
							  <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
							  </el-tooltip>
						  </template>
						</el-table-column>
				      </el-table>
			  </el-row>
			  <el-row>
				  <el-pagination
				        @size-change="handleSizeChange"
				        @current-change="handleCurrentChange"
				        :current-page="queryInfo.pagenum"
				        :page-sizes="[1 ,2, 5, 10]"
				        :page-size="queryInfo.pagesize"
				        layout="total, sizes, prev, pager, next, jumper"
				        :total="total">
				      </el-pagination>
			  </el-row>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog
		  title="提示"
		  :visible.sync="addDialogVisible" @close="addDialogClosed"
		  width="50%">
		  <el-form :model="addForm" :rules="addUserRules" ref="addFormRef" label-width="70px">
			  <el-form-item label="用户名" prop="username">
				  <el-input v-model="addForm.username"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			  	 <el-input v-model="addForm.password"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			  	 <el-input v-model="addForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机" prop="mobile">
			  	 <el-input v-model="addForm.mobile"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addUser">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 修改用户信息 -->
		<el-dialog
		  title="提示"
		  :visible.sync="editDialogVisible" 
		  width="50%" >
		  <el-form :model="editForm" ref="editFormRef" label-width="70px">
			  <el-form-item label="用户名" prop="username" >
				  <el-input v-model="editForm.username" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			  	 <el-input v-model="editForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机" prop="mobile">
			  	 <el-input v-model="editForm.mobile"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editUser()">确 定</el-button>
		  </span>
		</el-dialog>
		
		<el-dialog
		  title="分配角色"
		  :visible.sync="setRoleDialogVisible" 
		  width="50%" @close="setRoleDialogClosed">
		  <div>
			 <p>用户名：{{userInfo.username}}</p>
			 <p>角色：{{userInfo.role_name}}</p>
			 <el-select v-model="SelectedRoleId">
				 <el-option v-for="role in rolesList" :key="role.id" :label="role.roleName" :value="role.id">
					 
				 </el-option>
			 </el-select>
			 
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRoleDialogVisible = false" >取 消</el-button>
		    <el-button type="primary" @click="allocateNewRole" >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				//参数
				queryInfo:{
				query:'',
				pagenum:1,
				pagesize:2,
				},
				userlist:[],
				total:0,
				addDialogVisible:false,
				addForm:{
					username:'',
					password:'',
					email:'',
					mobile:''
				},
				editDialogVisible:false,
				editForm:{
					id:'',
					username:'',
					email:'',
					mobile:''
				},
				addUserRules:{
					username:[
						{
							required:true,
						    message:"请输入用户名",
							trigger:'blur'
						},
						{min:3,max:10,message:'用户名长度3-10',trigger:'blur'}
					],
					password:[
						{
							required:true,
						    message:"请输入密码",
							trigger:'blur'
						},
						{min:3,max:10,message:'密码长度3-10',trigger:'blur'}
					]
				},
				setRoleDialogVisible:false,
			    userInfo: {},
				rolesList:[],
				SelectedRoleId:''
			}
		},
		created(){
			this.getUserList()
		},
		methods:{
			async getUserList(){
				let {data} = await this.$axios.get('users',{params:this.queryInfo})
				console.log(data)
				if(data.meta.status != 200)
				return this.$el_message.error(data.meta.message)
				this.userlist = data.data.users
				this.total = data.data.total
			},
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			async switchChange(status){
				let {data} = await this.$axios.put(`users/${status.id}/state/${status.mg_state}`)
				if(data.meta.status != 200){
				 status.mg_state = !status.mg_state
				 return this.$el_message.error('更新用户状态失败')
				 
				 }
				 return this.$el_message.success('更新用户状态成功！')
			},
			addDialogClosed(){
				
				this.$refs.addFormRef.resetFields()
			},
			addUser(){
				this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return
					let {data} = await this.$axios.post('users',this.addForm)
					if(data.meta.status != 201){
					 return this.$el_message.error('添加用户失败')
					 }
					 this.$el_message.success('添加用户成功！')
					 this.addDialogVisible = false
					 this.getUserList()
					 
				})
			},
			editUserInformation(row){
				
				this.editForm.username = row.username
				this.editForm.email = row.email
				this.editForm.mobile = row.mobile
				this.editForm.id = row.id
				this.editDialogVisible = true
				
				
			},
			async editUser(){
				let {data} = await this.$axios.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
				if(data.meta.status !== 200) return this.$el_message.error(data.meta.message)
				this.getUserList()
				this.$refs.editFormRef.resetFields()
				this.editDialogVisible = false
				this.$el_message.success('修改用户信息成功')
				
			},
			async deleteUser(id){
				
				try{
				let result = await this.$el_confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        })
			    let	 {data} =  await this.$axios.delete('users/'+id)
				if(data.meta.status != 200) 
				{
					return this.$el_message.error("删除失败")
				}
				this.$el_message({
				  type: 'success',
				  message: '删除成功!'
				});
				this.getUserList()
					}
				catch{
				this.$el_message({
					type: 'info',
					message: '已取消删除'
						});          
				}
				
						
			},
			async setRole(userInfo){
				this.userInfo = userInfo
				let {data} = await this.$axios.get('roles')
				if(data.meta.status !== 200) return 
				this.rolesList = data.data
				this.setRoleDialogVisible = true
				
				},
			async allocateNewRole(){
				if(!this.SelectedRoleId)
				return this.$el_message.error('请选择要分配的角色')
				this.userInfo.id
				this.SelectedRoleId
				let {data} = await this.$axios.put(`users/${this.userInfo.id}/role`,{rid:this.SelectedRoleId})
				console.log(data)
				if(data.meta.status !== 200) return this.$el_message.error(data.meta.msg)
				this.$el_message.success(data.meta.msg)
				
				this.getUserList()
				this.setRoleDialogVisible = false
				
			},
			setRoleDialogClosed(){
				this.selectedRoleId = ''
				this.userInfo = {}
			}
			},//end methods
			
			
			
	}
</script>

<style lang="less" scoped>
	
</style>
