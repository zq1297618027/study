package com.neo.web;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.support.NullValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neo.entity.City;


@RestController
@RequestMapping("/schema")
//Java语法测试
public class SchemaController {

	//日志输出
	private static final Logger logger = LoggerFactory.getLogger(SchemaController.class.getName());
	//日期时间格式化
	@RequestMapping("/date")
	public String getFormatDate() {
		//1.声明SimpleDateFormat对象的实例simpleDateFormat变量并根据格式初始化
		//2.调用simpleDateFormat的实例方法format，参数为要格式化的日期，此方法返回String类型
		Date date = new Date();	
		//String patten = "yyyy-MM-dd hh:mm:ss";//2017-12-01 02:33:19
		String patten = "yyyy-MM-dd HH:mm:ss EEEE";//2017-12-01 14:33:19
		//String patten = "yyyy年MM月dd日 HH时mm分ss秒";//2017年12月01日 14时32分13秒
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(patten);
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("当前日期==");
		stringBuilder.append(simpleDateFormat.format(date));
		return stringBuilder.toString();
	}
	//City(Integer id, Integer provinceId, String cityName, String description)
	@RequestMapping("/map")
	@Autowired
	public Map<String, City> getMap(){
		Map<String, City> map = new HashMap<String, City>();
		map.put("0", new City(1,1001,"武汉","武汉是一座美丽的城市！"));
		map.put("1", new City(2,1002,"襄阳","襄阳诸葛亮！"));
		map.put("2", new City(3,1003,"枣阳","枣阳汉城！"));
		return map;
	}
	
	@RequestMapping("getMap")
	public String getContent() {
		logger.info("getContent======================Start");
		//map存数据用put,取数据用get,key值集合map.keySet(),values值集合map.values()
		StringBuilder stringBuilder = new StringBuilder();
		Map<String, City> map = new HashMap<String, City>();
		map.put("1", new City(1,1001,"武汉","武汉是一座美丽的城市！"));
		map.put("2", new City(2,1002,"襄阳","襄阳诸葛亮！"));
		map.put("3", new City(3,1003,"枣阳","枣阳汉城！"));
		
		//方式一：通过Map.keySet遍历key和value
		stringBuilder.append("方式一===");
		for (String str : map.keySet()) {
			//map.keySet()返回的是所有key的值
			stringBuilder.append(str);
			stringBuilder.append(":");	
			stringBuilder.append(map.get(str));
			stringBuilder.append(" ;");
		}
		
		stringBuilder.append("方式二===");
		//通过Map.entrySet使用iterator遍历key和value
		Iterator<Map.Entry<String, City>>it = map.entrySet().iterator();
		while(it.hasNext()) {
			Map.Entry<String, City> entry = it.next();
			stringBuilder.append(entry.getKey());
			stringBuilder.append(":");	
			stringBuilder.append(entry.getValue());
			stringBuilder.append(";");				
		}
		
		stringBuilder.append("方式三（方法2的变体）===");
		for (Map.Entry<String, City> entry : map.entrySet()) {
			//此处可以使用entry.setValue()修改值，注意类型匹配
			//entry.setValue(new City(999, 9999, "Andy", "Andy is very handsome"));
			stringBuilder.append(entry.getKey());
			stringBuilder.append(":");	
			stringBuilder.append(entry.getValue());
			stringBuilder.append(";");	
		}
		
		stringBuilder.append("方式四(遍历值)===");
		for (City city : map.values()) {
			stringBuilder.append(city);
			stringBuilder.append(";");	
		}
		logger.info("getContent======================End");
		return stringBuilder.toString();
	}
	
}
