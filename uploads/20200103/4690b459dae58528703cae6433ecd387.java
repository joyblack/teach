package com.mky.mkcompany.summary.service;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.mky.mkcompany.common.service.BaseService;
import com.mky.mkcompany.common.utils.BigDecimalUtil;
import com.mky.mkcompany.common.utils.ComputeUtil;
import com.mky.mkcompany.common.utils.excel.ExportUtil;
import com.mky.mkcompany.common.vo.YearMonthVo;
import com.mky.mkcompany.fillform.domain.dao.FillFormDao;
import com.mky.mkcompany.fillform.domain.entity.FillForm;
import com.mky.mkcompany.project.domain.dao.ProjectDao;
import com.mky.mkcompany.project.domain.entity.Project;
import com.mky.mkcompany.project.domain.enums.ProjectType;
import com.mky.mkcompany.statics.domain.dao.CityDao;
import com.mky.mkcompany.statics.domain.entity.City;
import com.mky.mkcompany.statics.service.CityService;
import com.mky.mkcompany.summary.domain.dao.SummaryElectricDao;
import com.mky.mkcompany.summary.domain.entity.SummaryElectric;
import com.mky.mkcompany.summary.domain.entity.SummaryInvestment;
import com.mky.mkcompany.summary.domain.enums.SummaryElectricDataType;
import com.mky.mkcompany.user.domain.dao.UserDao;
import com.mky.mkcompany.user.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author joy black on 2019/12/20 9:27
 * @version 1.0
 */
@Service
public class SummaryElectricService extends BaseService {

    @Autowired
    private SummaryElectricDao summaryElectricDao;

    @Autowired
    private CityService cityService;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private CityDao cityDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private FillFormDao fillFormDao;

    private static String[] PROJECT_TYPES = {"（一）、风力发电", "（二）、光伏发电", "（三）、农林生物质发电", "（四）、垃圾发电"};

    private static final String EXCEL_FILE = "贵州省新能源发电情况统计表";
    private static final String[] EXCEL_HEAD = {"序号", "项目名称", "装机容量（万千瓦）", "本月", "累计"};

    /**
     * 根据项目生成一条统计数据
     */
    private SummaryElectric formatByProject(Project p, String ym) {
        SummaryElectric s = new SummaryElectric().init();
        YearMonthVo ymVo = YearMonthVo.parse(ym);
        // 时间
        s.setFillYM(ym);
        // 项目ID
        s.setProjectId(p.getId());
        // 项目类型
        s.setProjectType(p.getProjectType());
        // 项目名称
        s.setProjectName(p.getProjectName());
        // 所属企业
        s.setUserId(p.getUserId());
        // 项目地区
        City city = cityDao.findFirstByValue(p.getArea2());
        s.setArea(city.getLabel());
        s.setAreaCode(city.getValue());
        // 数据类型： 统计数据项目详情类型
        s.setDataType(SummaryElectricDataType.TYPE_DETAIL);
        // 装机规模（万kW）
        s.setConstructionScale(BigDecimalUtil.nullTrans(p.getConstructionScale()));
        FillForm fillForm = fillFormDao.findFirstByFillYMAndProjectId(ym, p.getId());
        // 月发电量
        s.setMonthElectricProduceCapacity(fillForm == null? BigDecimal.ZERO : BigDecimalUtil.nullTrans(fillForm.getMonthElectricProduceCapacity()));
        // 年发电量
        BigDecimal yearElectricProduceCapacity = fillFormDao.summaryYearElectricProduceCapacity(ymVo.getYear(), ymVo.getMonth(), p.getId());
        s.setYearElectricProduceCapacity(BigDecimalUtil.nullTrans(yearElectricProduceCapacity));
        return s;
    }

    public List<SummaryElectric> get(String ym){
        init(ym);
        List<SummaryElectric> res = new ArrayList<>();
        // 试探是否有数据
        if(summaryElectricDao.findFirstByFillYM(ym) == null) {
            return res;
        }

        // 将所有数据加载到内存处理，不然查询次数过多，一月的统计数据
        // 应该在内存的可接受范围内，可以进行这样的操作
        List<SummaryElectric> data = summaryElectricDao.findAllByFillYM(ym);

        // 类型：小类型汇总数据
        List<SummaryElectric> typeSingleSummaryData = data.stream().filter(d ->
                SummaryElectricDataType.TYPE_SINGLE_SUMMARY.equals(d.getDataType())
        ).collect(Collectors.toList());

        // 类型：企业数据
        List<SummaryElectric> typeEnterpriseData = data.stream().filter(d ->
                SummaryElectricDataType.TYPE_ENTERPRISE.equals(d.getDataType())
        ).collect(Collectors.toList());

        // 类型：详情数据
        List<SummaryElectric> typeDetailData = data.stream().filter(d ->
                SummaryElectricDataType.TYPE_DETAIL.equals(d.getDataType())
        ).collect(Collectors.toList());


        // 市州：从总数据集中直接获取即可
        // == 总、分
        res.add(data.stream().filter(d -> SummaryElectricDataType.CITY_ALL.equals(d.getDataType())).findFirst().orElse(null));
        // == 分
        res.addAll(data.stream().filter(d -> SummaryElectricDataType.CITY_DETAIL.equals(d.getDataType())).collect(Collectors.toList()));

        // 四大类
        // == 总：直接从数据集获取
        res.add(data.stream().filter(d -> SummaryElectricDataType.TYPE_ALL.equals(d.getDataType())).findFirst().orElse(null));

        //
        /*
         * == 分
         * 风、光、生物、垃圾：小汇总、企业、项目
         * 处理企业、详情数据是：
         * 1、获取企业列表，依次处理企业列表，以此添加详情数据
         * 2、这类数据的特色：userId为企业ID，数据类型为TYPE_ENTERPRISE,项目类型字段为所包含的项目的项目类型
         */
        res.add(typeSingleSummaryData.stream().filter(d -> ProjectType.WIND.equals(d.getProjectType())).findFirst().orElse(null));

        List<SummaryElectric> es = typeEnterpriseData.stream().filter(d -> ProjectType.WIND.equals(d.getProjectType())).collect(Collectors.toList());
        for (SummaryElectric e : es) {
            // 添加一条企业数据
            res.add(e);
            // 添加企业旗下的项目数据
            res.addAll(typeDetailData.stream().filter(d ->
                    e.getUserId().equals(d.getUserId()) &&
                    ProjectType.WIND.equals(d.getProjectType())).collect(Collectors.toList()));

        }

        // 光
        res.add(typeSingleSummaryData.stream().filter(d -> ProjectType.LIGHT.equals(d.getProjectType())).findFirst().orElse(null));
        es = typeEnterpriseData.stream().filter(d -> ProjectType.LIGHT.equals(d.getProjectType())).collect(Collectors.toList());
        for (SummaryElectric e : es) {
            res.add(e);
            res.addAll(typeDetailData.stream().filter(d ->
                    e.getUserId().equals(d.getUserId()) &&
                            ProjectType.LIGHT.equals(d.getProjectType())).collect(Collectors.toList()));
        }

        // 生物
        res.add(typeSingleSummaryData.stream().filter(d -> ProjectType.BIOLOGY.equals(d.getProjectType())).findFirst().orElse(null));
        es = typeEnterpriseData.stream().filter(d -> ProjectType.BIOLOGY.equals(d.getProjectType())).collect(Collectors.toList());
        for (SummaryElectric e : es) {
            res.add(e);
            res.addAll(typeDetailData.stream().filter(d ->
                    e.getUserId().equals(d.getUserId()) &&
                            ProjectType.BIOLOGY.equals(d.getProjectType())).collect(Collectors.toList()));
        }

        // 垃圾发电
        res.add(typeSingleSummaryData.stream().filter(d -> ProjectType.GARBAGE.equals(d.getProjectType())).findFirst().orElse(null));
        es = typeEnterpriseData.stream().filter(d -> ProjectType.GARBAGE.equals(d.getProjectType())).collect(Collectors.toList());
        for (SummaryElectric e : es) {
            res.add(e);
            res.addAll(typeDetailData.stream().filter(d ->
                    e.getUserId().equals(d.getUserId()) &&
                            ProjectType.GARBAGE.equals(d.getProjectType())).collect(Collectors.toList()));
        }
        return res;
    }


    /**
     * 初始化本月的起始数据，一般会在月初零点调用
     */
    public boolean init(String ym){
        List<SummaryElectric> res = new ArrayList<>();
        YearMonthVo ymVo = YearMonthVo.parse(ym);

        // 检测是否已经拥有初始化数据
        SummaryElectric check = summaryElectricDao.findFirstByFillYM(ym);

        // 若没有数据，则进行初始化操作
        if(check != null){
            return false;
        }

        // 市州
        // 总
        SummaryElectric cityAll = new SummaryElectric().init();
        cityAll.setFillYM(ym);
        cityAll.setOrderNumber("一");
        cityAll.setProjectName("一、各市州新能源发电量");
        cityAll.setDataType(SummaryElectricDataType.CITY_ALL);
        res.add(cityAll);

        // 贵州省数据
        City gz = cityDao.findFirstByLabel("贵州省");
        // 总-市
        List<City> cities = cityDao.findAllByParentId(gz.getId());
        for (int i = 0; i < cities.size(); i++) {
            City city = cities.get(i);
            SummaryElectric r1Detail = new SummaryElectric().init();
            r1Detail.setFillYM(ym);
            r1Detail.setOrderNumber((i + 1) + "");
            r1Detail.setProjectName(city.getLabel());
            r1Detail.setDataType(SummaryElectricDataType.CITY_DETAIL);
            r1Detail.setArea(city.getLabel());
            r1Detail.setAreaCode(city.getValue());

            // 装机规模（万kW）
            BigDecimal c = projectDao.summaryC(city.getValue());
            r1Detail.setConstructionScale(BigDecimalUtil.nullTrans(c));

            // 月发电量
            BigDecimal m = fillFormDao.summaryMonthElectricProduceCapacity(ym, city.getValue());
            r1Detail.setMonthElectricProduceCapacity(BigDecimalUtil.nullTrans(m));

            // 年发电量
            BigDecimal y = fillFormDao.summaryYearElectricProduceCapacity(ymVo.getYear(), ymVo.getMonth(), city.getValue());
            r1Detail.setYearElectricProduceCapacity(BigDecimalUtil.nullTrans(y));

            // 加入汇总数据
            cityAll.setConstructionScale(ComputeUtil.add2(cityAll.getConstructionScale(), r1Detail.getConstructionScale()));
            cityAll.setMonthElectricProduceCapacity(ComputeUtil.add2(cityAll.getMonthElectricProduceCapacity(), r1Detail.getMonthElectricProduceCapacity()));
            cityAll.setYearElectricProduceCapacity(ComputeUtil.add2(cityAll.getYearElectricProduceCapacity(), r1Detail.getYearElectricProduceCapacity()));

            res.add(r1Detail);
        }

        // 各类型投资
        // 总
        SummaryElectric typeAll = new SummaryElectric().init();
        typeAll.setOrderNumber("二");
        typeAll.setFillYM(ym);
        typeAll.setProjectName("二、各新能源发电企业发电量");
        typeAll.setDataType(SummaryElectricDataType.TYPE_ALL);
        res.add(typeAll);

        // 四大类
        for (Integer projectType = 0; projectType < 4; projectType ++) {
            // 小类汇总数据
            SummaryElectric t = new SummaryElectric().init();
            res.add(t);
            // 时间
            t.setFillYM(ym);
            // 数据类型
            t.setDataType(SummaryElectricDataType.TYPE_SINGLE_SUMMARY);
            // 项目类型
            t.setProjectType(projectType);
            if (ProjectType.WIND.equals(projectType)) {
                t.setOrderNumber("（一）");
                t.setProjectName("（一）、风力发电");
            } else if (ProjectType.LIGHT.equals(projectType)) {
                t.setOrderNumber("（二）");
                t.setProjectName("（二）、光伏发电");
            } else if (ProjectType.BIOLOGY.equals(projectType)) {
                t.setOrderNumber("（三）");
                t.setProjectName("（三）、农林生物质发电");
            } else {
                t.setOrderNumber("（四）");
                t.setProjectName("（四）、垃圾发电");
            }

            List<Project> ps = projectDao.findAllByProjectTypeOrderByUserId(projectType);
            Map<Long, List<Project>> groups = ps.stream().collect(Collectors.groupingBy(Project::getUserId));

            if(groups != null && !groups.isEmpty()) {
                for (Long uid : groups.keySet()) {
                    User user = userDao.findAllById(uid);

                    // 企业条目
                    SummaryElectric es = new SummaryElectric().init();
                    res.add(es);
                    es.setDataType(SummaryElectricDataType.TYPE_ENTERPRISE);
                    es.setFillYM(ym);
                    es.setProjectName(user.getEnterpriseName());
                    es.setUserId(user.getId());
                    es.setEnterpriseName(user.getEnterpriseName());
                    es.setProjectType(projectType);

                    List<Project> projects = groups.get(uid);
                    for (Project project : projects) {
                        // 项目详情
                        SummaryElectric detail = formatByProject(project, ym);
                        res.add(detail);
                        // 汇总结果
                        // == 企业汇总
                        es.setConstructionScale(ComputeUtil.add2(es.getConstructionScale(), detail.getConstructionScale()));
                        es.setMonthElectricProduceCapacity(ComputeUtil.add2(es.getMonthElectricProduceCapacity(), detail.getMonthElectricProduceCapacity()));
                        es.setYearElectricProduceCapacity(ComputeUtil.add2(es.getYearElectricProduceCapacity(), detail.getYearElectricProduceCapacity()));
                        // == 小类汇总
                        t.setConstructionScale(ComputeUtil.add2(t.getConstructionScale(), detail.getConstructionScale()));
                        t.setMonthElectricProduceCapacity(ComputeUtil.add2(t.getMonthElectricProduceCapacity(), detail.getMonthElectricProduceCapacity()));
                        t.setYearElectricProduceCapacity(ComputeUtil.add2(t.getYearElectricProduceCapacity(), detail.getYearElectricProduceCapacity()));
                    }
                }
            }
            // 大类汇总: 将小类汇总叠加到此处即可
            typeAll.setConstructionScale(ComputeUtil.add2(typeAll.getConstructionScale(), t.getConstructionScale()));
            typeAll.setMonthElectricProduceCapacity(ComputeUtil.add2(typeAll.getMonthElectricProduceCapacity(), t.getMonthElectricProduceCapacity()));
            typeAll.setYearElectricProduceCapacity(ComputeUtil.add2(typeAll.getYearElectricProduceCapacity(), t.getYearElectricProduceCapacity()));
        }
        summaryElectricDao.saveAll(res);
        return true;
    }

    /**
     * 刷新数据
     */
    public void refresh(String ym){
        summaryElectricDao.deleteAllByFillYM(ym);
        init(ym);
    }

    /**
     * 导出数据
     */
    public void export(String fillYM, HttpServletRequest request, HttpServletResponse response) {
        List<SummaryElectric> infos = get(fillYM);
        ExcelWriter writer = ExcelUtil.getWriter();
        // 表头
        writer.merge(EXCEL_HEAD.length - 1, EXCEL_FILE + fillYM);
        // 列头
        for (int i = 0; i < EXCEL_HEAD.length; i++) {
            if(i <= 2){
                writer.merge(1,2, i, i, EXCEL_HEAD[i],false);
            }else{
                writer.writeCellValue(i,2, EXCEL_HEAD[i]);
            }
        }
        writer.merge(1,1, 3, 4, "发电量（万千瓦时）",false);
        // 跳转到第3行，写入数据
        writer.setCurrentRow(3);
        for (SummaryElectric r : infos) {
            List<Object> ctl = CollUtil.newArrayList(
                    // 序号
                    r.getOrderNumber(),
                    // 项目名称
                    r.getProjectName(),
                    // 装机容量
                    r.getConstructionScale() == null? "" : r.getConstructionScale(),
                    // 发电量 - 本月
                    r.getMonthElectricProduceCapacity() == null? "" : r.getMonthElectricProduceCapacity(),
                    // 发电量 - 本年
                    r.getYearElectricProduceCapacity() == null? "" : r.getYearElectricProduceCapacity()
            );
            writer.writeRow(ctl);
            // 若是非数据行，要和并前两列
            if(!r.getDataType().equals(1) && !r.getDataType().equals(5)) {
                writer.merge(writer.getCurrentRow() - 1, writer.getCurrentRow() - 1, 0, 1, r.getProjectName(), false);
            }
        }
        // full width
        writer.autoSizeColumnAll();
        ExportUtil.exportData(request, response, EXCEL_FILE + fillYM, writer);
    }


    /**
     * 当操作项目数据时：建设规模，关联企业的数据，因为删除项目必须保证项目不存在日报，因此只会涉及建设规模数据的计算
     * 以下操作如果出现异常，说明统计数据归纳过程有错，本方法内部不会进行任何异常捕捉
     */
    public void whenOptProject(Project project, boolean isDelete){
        String ym = YearMonthVo.getNowYM();
        if (init(ym)) {
            return;
        }
        // 变化量
        BigDecimal offsetConstructionScale;
        // 项目本身的建设规模
        BigDecimal constructionScale = project.getConstructionScale();
        // 企业信息
        User user = userDao.findAllById(project.getUserId());
        if(isDelete) {
            // 删除关联的项目明细统计数据
            SummaryElectric detail = summaryElectricDao.findFirstByFillYMAndProjectIdAndDataType(
                    ym,
                    project.getId(),
                    SummaryElectricDataType.TYPE_DETAIL
            );
            summaryElectricDao.delete(detail);
            offsetConstructionScale = BigDecimalUtil.nullTrans(detail.getConstructionScale()).negate();
        } else {
            SummaryElectric oldDetail = summaryElectricDao.findFirstByFillYMAndProjectIdAndDataType(
                    ym,
                    project.getId(),
                    SummaryElectricDataType.TYPE_DETAIL
            );
            // 说明是更新
            if(oldDetail != null){
                offsetConstructionScale = ComputeUtil.subtract(constructionScale, oldDetail.getConstructionScale());
                oldDetail.setProjectName(project.getProjectName());
                oldDetail.setConstructionScale(project.getConstructionScale());
                summaryElectricDao.save(oldDetail);
            } else {
                // 说明是新增
                SummaryElectric detail = formatByProject(project, ym);
                offsetConstructionScale = detail.getConstructionScale();
                summaryElectricDao.save(detail);

                // 是否需要新增一条企业数据
                SummaryElectric es = summaryElectricDao.findFirstByFillYMAndDataTypeAndProjectTypeAndUserId(ym,
                        SummaryElectricDataType.TYPE_ENTERPRISE,
                        project.getProjectType(),
                        project.getUserId()
                );
                // 若新增，先别急着设置建设规模字段，留在最后设置即可。
                if(es == null) {
                    // 企业条目
                    es = new SummaryElectric().init();
                    es.setDataType(SummaryElectricDataType.TYPE_ENTERPRISE);
                    es.setFillYM(ym);
                    es.setProjectName(user.getEnterpriseName());
                    es.setUserId(user.getId());
                    es.setEnterpriseName(user.getEnterpriseName());
                    es.setProjectType(project.getProjectType());
                    summaryElectricDao.save(es);
                }
            }
        }
        // 从下至上
        // 企业数据修改
        SummaryElectric es = summaryElectricDao.findFirstByFillYMAndDataTypeAndProjectTypeAndUserId(ym,
                SummaryElectricDataType.TYPE_ENTERPRISE,
                project.getProjectType(),
                project.getUserId()
        );
        es.setConstructionScale(ComputeUtil.add2(es.getConstructionScale(), offsetConstructionScale));
        summaryElectricDao.save(es);

        // 所属类别更新
        SummaryElectric ts = summaryElectricDao.findFirstByFillYMAndDataTypeAndProjectType(ym,
                SummaryElectricDataType.TYPE_SINGLE_SUMMARY,
                project.getProjectType()
        );
        ts.setConstructionScale(ComputeUtil.add2(ts.getConstructionScale(), offsetConstructionScale));
        summaryElectricDao.save(ts);

        // 所属大类别更新
        SummaryElectric ta = summaryElectricDao.findFirstByFillYMAndDataType(ym,
                SummaryElectricDataType.TYPE_ALL
        );
        ta.setConstructionScale(ComputeUtil.add2(ta.getConstructionScale(), offsetConstructionScale));
        summaryElectricDao.save(ta);

        // 所属市数据更新
        SummaryElectric cityDetail = summaryElectricDao.findFirstByFillYMAndDataTypeAndAreaCode(ym, SummaryElectricDataType.CITY_DETAIL, project.getArea2());
        cityDetail.setConstructionScale(ComputeUtil.add2(cityDetail.getConstructionScale(), offsetConstructionScale));
        summaryElectricDao.save(cityDetail);

        // 大地区汇总数据更新
        SummaryElectric cityAll = summaryElectricDao.findFirstByFillYMAndDataType(ym,
                SummaryElectricDataType.CITY_ALL
        );
        cityAll.setConstructionScale(ComputeUtil.add2(cityAll.getConstructionScale(), offsetConstructionScale));
        summaryElectricDao.save(cityAll);
    }


    /**
     * 当操作上报信息时：月累计发电、年累计发电
     */
    public void whenOptFillForm(FillForm fillForm, FillForm fillFormOld, boolean isDelete){
        String ym = fillForm.getFillYM();
        YearMonthVo ymVo = YearMonthVo.parse(ym);
        if (init(ym)) {
            return;
        }
        Project project = projectDao.findAllById(fillForm.getProjectId());
        if (isDelete) {
            SummaryElectric deleteSummary = summaryElectricDao.findFirstByFillYMAndProjectIdAndDataType(ym, project.getId(), SummaryElectricDataType.TYPE_DETAIL);
            summaryElectricDao.delete(deleteSummary);
        } else {
            if(fillFormOld != null){// 修改数据，新增数据
                // 获取详情数据
                SummaryElectric detail = summaryElectricDao.findFirstByFillYMAndProjectIdAndDataType(ym, fillForm.getProjectId(), SummaryElectricDataType.TYPE_DETAIL);
                detail.setMonthElectricProduceCapacity(fillForm.getMonthElectricProduceCapacity());
                detail.setYearElectricProduceCapacity(ComputeUtil.add2(detail.getYearElectricProduceCapacity(), offsetElectric));
                summaryElectricDao.save(detail);
            } else {//

            }
        }

        // 从下至上
        // 企业数据修改
        SummaryElectric es = summaryElectricDao.findFirstByFillYMAndDataTypeAndProjectTypeAndUserId(
                ym,
                SummaryElectricDataType.TYPE_ENTERPRISE,
                project.getProjectType(),
                project.getUserId()
        );
        es.setMonthElectricProduceCapacity(ComputeUtil.add2(es.getMonthElectricProduceCapacity(), offsetElectric));
        es.setYearElectricProduceCapacity(ComputeUtil.add2(es.getYearElectricProduceCapacity(), offsetElectric));
        summaryElectricDao.save(es);

        // 所属类别更新
        SummaryElectric ts = summaryElectricDao.findFirstByFillYMAndDataTypeAndProjectType(ym,
                SummaryElectricDataType.TYPE_SINGLE_SUMMARY,
                project.getProjectType()
        );
        ts.setMonthElectricProduceCapacity(ComputeUtil.add2(ts.getMonthElectricProduceCapacity(), offsetElectric));
        ts.setYearElectricProduceCapacity(ComputeUtil.add2(ts.getYearElectricProduceCapacity(), offsetElectric));
        summaryElectricDao.save(ts);

        // 所属大类别更新
        SummaryElectric ta = summaryElectricDao.findFirstByFillYMAndDataType(ym,
                SummaryElectricDataType.TYPE_ALL
        );
        ta.setMonthElectricProduceCapacity(ComputeUtil.add2(ta.getMonthElectricProduceCapacity(), offsetElectric));
        ta.setYearElectricProduceCapacity(ComputeUtil.add2(ta.getYearElectricProduceCapacity(), offsetElectric));
        summaryElectricDao.save(ta);

        // 所属市数据更新
        SummaryElectric cityDetail = summaryElectricDao.findFirstByFillYMAndDataTypeAndAreaCode(ym, SummaryElectricDataType.CITY_DETAIL, project.getArea2());
        cityDetail.setMonthElectricProduceCapacity(ComputeUtil.add2(cityDetail.getMonthElectricProduceCapacity(), offsetElectric));
        cityDetail.setYearElectricProduceCapacity(fillFormDao.summaryYearElectricProduceCapacity(ymVo.getYear(), ymVo.getMonth(), fillForm.getProjectId()));
        summaryElectricDao.save(cityDetail);

        // 大地区汇总数据更新
        SummaryElectric cityAll = summaryElectricDao.findFirstByFillYMAndDataType(ym,
                SummaryElectricDataType.CITY_ALL
        );
        cityAll.setMonthElectricProduceCapacity(ComputeUtil.add2(cityAll.getMonthElectricProduceCapacity(), offsetElectric));
        cityAll.setYearElectricProduceCapacity(ComputeUtil.add2(cityAll.getYearElectricProduceCapacity(), offsetElectric));
        summaryElectricDao.save(cityAll);
    }
}
