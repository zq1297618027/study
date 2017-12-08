package com.neo.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class DefaultController{
	
	@RequestMapping(value = {"/index","/"})
    public String index() {
        return "index";
    }
    
	@RequestMapping("/hello")
    public String hello() {
        return "hello";
    }
	@RequestMapping("/dd")
    public String dd() {
        return "dd";
    }
	
	@RequestMapping("/login")
    public String login() {
        return "login";
    }
	
	@RequestMapping("/reg")
    public String reg() {
        return "register";
    }
	@RequestMapping("/forgetPwd")
    public String forgetPwd() {
        return "forgetPwd";
    }
}