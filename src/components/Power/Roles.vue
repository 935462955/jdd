<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
			<el-col>
				<el-button type="primary">添加角色</el-button>
			</el-col>
			</el-row>
			<el-table :data="rolelist" border stripe>
				<el-table-column type="expand">
					<template v-slot:default ="scope" > 
						<el-row :class="['vcenter','bdbottom',i1 == 0 ? 'bdtop' : '']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">
								{{item1.authName}}
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							
							<el-col :span="19">
								<el-row :class="['vcenter',i2 != 0 ? 'bdtop':'']" v-for="(item2,i2) in item1.children" :key="item2.id" >
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
										{{item2.authName}}
										</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										
										<el-tag type="warning" v-for="(item3,i3) in item2.children" 
										:key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
										{{item3.authName}}
										</el-tag>
										
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width:300px>
					<template v-slot:default="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightsAssign(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
		  title="分配权限"
		  :visible.sync="setRightDialogVisible" 
		  width="50%" >
		 <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox default-expand-all  node-key="id" :default-checked-keys="defKeys">
			 
		 </el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightDialogVisible = false" >取 消</el-button>
		    <el-button type="primary" @click="allocatRights">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
	
</template>

<script>
	export default{
		data(){
			return{
				rolelist:[],
				setRightDialogVisible:false,
				rightsList:[],
				treeProps:{
						  label:'authName',
						  children:'children'
				},
				defKeys:[    //默认选中的权限
			
				],
				roleId:'',//设置权限的角色id
				
			}
		},
		created(){
			this.getRolesList()
			
		},
		methods:{
		    async getRolesList()
			{
				let {data} = await this.$axios.get('roles')
				if(data.meta.status !== 200) return this.$el_message.error(data.meta)

				this.rolelist = data.data
			},
			async removeRightById(role,rightsId){
				let result = await this.$el_confirm('此操作将永久删除该文件，是否继续','提示',{
					confirmButtonText:'确定',
				    cancelButtonText:'取消',
					type:'warning'
				}).catch(err => err)
				if(result !== 'confirm') return
				let {data} = await this.$axios.delete(`roles/${role.id}/rights/${rightsId}`)
				if(data.meta.status != 200) return this.$el_message.error(data.meta)
				
				role.children = data.data
			},
			async showRightsAssign(row){
				const { data: res } = await this.$axios.get('rights/tree')
				if (res.meta.status !== 200) {
				  return this.$message.error('获取权限列表失败！')
				}
				
				this.rightsList = res.data
		        let tempRoleRights = []
				console.log(row)
				for(let i = 0; i < row.children.length;i++)
				{	
					
					for(let ii = 0 ; ii < row.children[i].children.length;ii++)
					{
						
						for(let iii = 0 ; iii < row.children[i].children[ii].children.length;iii++)
							tempRoleRights.push(row.children[i].children[ii].children[iii].id)
					}
				}
				this.roleId = row.id
				this.defKeys = tempRoleRights
				this.setRightDialogVisible = true
			},
			async allocatRights(){
				const key = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
				const idStr = key.join(',')
				let {data} = await this.$axios.post(`roles/${this.roleId}/rights`,{ rids:idStr})
				if (data.meta.status !== 200) {
				  return this.$message.error(data.meta.message)
				}
				this.$el_message.success('权限分配成功！')
				this.getRolesList()
				this.setRightDialogVisible = false
				
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.el-tag{
		margin:7px
	}
	.bdtop{
		border-top:1px solid #eee;
	}
	.bdbottom{
		border-bottom:1px solid #eee;
	}
	.vcenter{
		display:flex;
		align-items:center;
	}
</style>
