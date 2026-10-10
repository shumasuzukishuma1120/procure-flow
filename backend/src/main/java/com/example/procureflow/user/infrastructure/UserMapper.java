package com.example.procureflow.user.infrastructure;

import com.example.procureflow.security.CurrentUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    CurrentUser findActiveByCognitoSub(@Param("cognitoSub") String cognitoSub);
}
