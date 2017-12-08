package com.neo.service.impl;


import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.neo.service.MailService;

@Service
public class MailServiceImpl implements MailService {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private JavaMailSender mailSender;
	@Value("${mail.fromMail.addr}")
	private String from;
	
	@Override
	public void sendSimpleMail(String to, String subject, String content) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(to);
		message.setSubject(subject);
		message.setText(content);
		
		try {
			mailSender.send(message);
			logger.info("简单邮件发送成功！");
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("简单邮件发送异常！");
		}
	}
	
	@Override
	public void sendHtmlMail(String to, String subject, String content) {
		MimeMessage message = mailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message);
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(content,true);
			mailSender.send(message);
			logger.info("html邮件发送成功");
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("html邮件发送异常");
		}
		
	}

}
