package com.neo.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neo.entity.City;
import com.neo.mapper.CityMapper;

@RestController
public class CityController {
	@Autowired
	private CityMapper cityMapper;
	
	@RequestMapping(value="/getCitys")
	public List<City> selectAll() {		
		return cityMapper.selectAll() ;
	}
	
	@RequestMapping(value="/getCity")
	public City selectByPrimaryKey(Integer id) {		
		return cityMapper.selectByPrimaryKey(id) ;
	}
	@RequestMapping(value="/updateCity")
	public void update(City city) {
		cityMapper.updateByPrimaryKey(city);
	}
	
	@RequestMapping(value="/addCity")
	public void insert(City city) {
		cityMapper.insert(city);
	}

}
