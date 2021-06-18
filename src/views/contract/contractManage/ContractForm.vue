<template>
  <el-dialog title="新建合同" :visible.sync="visible" width="1200" top="10px">
    <div class="dialogWrapper">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
        </div>
        <div>
          <el-form ref="baseInfoForm" :model="baseInfo">
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同编号" label-width="120px" prop="code" style="margin-right: 20px">
                  <el-input v-model="baseInfo.code" placeholder="请输入合同编号" style="width: 250px"> </el-input>
                </el-form-item>
                <el-form-item label="合同名称" label-width="120px" prop="name" style="margin-right: 20px">
                  <el-input v-model="baseInfo.name" placeholder="请输入合同名称" style="width: 250px"> </el-input>
                </el-form-item>
                <el-form-item label="合同类型" label-width="120px" prop="contractType" style="margin-right: 20px">
                  <ContractTypeSelect v-model="baseInfo.contractType" style="width: 250px"></ContractTypeSelect>
                </el-form-item>
                <el-form-item label="合同金额(万元)" label-width="120px" prop="money" style="margin-right: 20px">
                  <el-input v-model.number="baseInfo.money" placeholder="请输入合同金额" style="width: 250px">
                  </el-input>
                </el-form-item>
                <el-form-item label="签订日期" label-width="120px" prop="time" style="margin-right: 20px">
                  <el-date-picker
                    v-model="baseInfo.time"
                    type="date"
                    placeholder="请选择签订日期"
                    style="width: 250px"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="招采方式" label-width="120px" prop="recruitType" style="margin-right: 20px">
                  <el-select v-model="baseInfo.recruitType">
                    <el-option value="null" label="全部"> </el-option>
                    <el-option value="0" label="招标"> </el-option>
                    <el-option value="1" label="非招标"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同工期" label-width="120px" prop="days" style="margin-right: 20px">
                  <el-input v-model.number="baseInfo.days" placeholder="请输入合同工期" style="width: 250px">
                  </el-input>
                </el-form-item>
                <el-form-item label="开工日期" label-width="120px" prop="startTime" style="margin-right: 20px">
                  <el-date-picker
                    v-model="baseInfo.startTime"
                    type="date"
                    placeholder="请选择开工日期"
                    style="width: 250px"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="竣工日期" label-width="120px" prop="endTime" style="margin-right: 20px">
                  <el-date-picker
                    v-model="baseInfo.endTime"
                    type="date"
                    placeholder="请选择竣工日期"
                    style="width: 250px"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="质保期(月)" label-width="120px" prop="warrantyMonth" style="margin-right: 20px">
                  <el-input v-model.number="baseInfo.warrantyMonth" placeholder="请输入质保期" style="width: 250px">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="AA" label-width="120px" prop="codeNameCreator" style="margin-right: 20px">
                  <el-input
                    v-model="baseInfo.codeNameCreator"
                    placeholder="需用计划编号 / 需用计划名称 / 创建人"
                    style="width: 250px"
                  >
                    <i slot="suffix" class="el-icon-search"></i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
export default {
  name: 'ContractForm',
  props: ['visible'],
  data() {
    return {
      baseInfo: {
        code: '',
        name: '',
        contractType: null,
        money: 0,
        time: null,
        recruitType: null,
        days: 0,
        startTime: '',
        endTime: '',
        warrantyMonth: 0
      },
      contractFormVisible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      contractType: contractType,
      contractStatus: contractStatus
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.dialogWrapper {
}
</style>
