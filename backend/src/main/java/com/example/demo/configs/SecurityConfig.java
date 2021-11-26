package com.example.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    public MyUserDetailsService myUserDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/**").permitAll()
                .antMatchers(HttpMethod.POST,"/api/newLogin").permitAll()
                .antMatchers("/auth/**", "/oauth2/**", "/login/**")
                .permitAll()
                .antMatchers("/chat/**").permitAll()
                .antMatchers(HttpMethod.POST,"/rest/bids").authenticated()
                //.antMatchers(HttpMethod.GET,"/api/whoami").authenticated()
                .antMatchers(HttpMethod.POST,"/rest/auctionItems").authenticated()
                .antMatchers(HttpMethod.GET,"/rest/bids").permitAll()
                .antMatchers(HttpMethod.GET, "/", "/rest/**").permitAll()
                .antMatchers(HttpMethod.GET, "/login").permitAll()
                .antMatchers("/api/relist/**").permitAll()
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/rest/**").authenticated();
    }


    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(myUserDetailsService)
                .passwordEncoder(myUserDetailsService.getEncoder());
    }


//    @Autowired
//    private CustomUserDetailsService customUserDetailsService;

    // if using custom login:
    @Bean("authenticationManager")
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

}