package com.neo.mapper;

import java.util.List;

import com.neo.entity.City;

public interface CityMapper {

    int deleteByPrimaryKey(Integer id);

    int insert(City record);

    int insertSelective(City record);

    City selectByPrimaryKey(Integer id);
    
    List<City> selectAll();

    int updateByPrimaryKeySelective(City record);

    int updateByPrimaryKey(City record);
}