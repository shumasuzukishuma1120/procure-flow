package com.example.procureflow.user.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.UUID;

@Mapper
public interface UserMapper {

    AuthenticatedUserRow findActiveByCognitoSub(@Param("cognitoSub") String cognitoSub);

    int updateCognitoSub(
            @Param("userId") UUID userId,
            @Param("cognitoSub") String cognitoSub
    );
}
