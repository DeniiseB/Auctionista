package com.example.demo.controllers;

import com.example.demo.services.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UploadController {

    @Autowired
    private UploadService uploadService;


    @PostMapping("/api/upload")
    public List<String> upload(@RequestParam List<MultipartFile> files){
        return uploadService.saveFiles(files);




        //return new ArrayList<>();
    }
}