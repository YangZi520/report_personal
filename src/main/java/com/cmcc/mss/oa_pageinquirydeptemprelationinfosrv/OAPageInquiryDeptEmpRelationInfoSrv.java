package com.cmcc.mss.oa_pageinquirydeptemprelationinfosrv;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * This class was generated by Apache CXF 3.2.4
 * 2018-05-23T16:37:00.628+08:00
 * Generated source version: 3.2.4
 *
 */
@WebService(targetNamespace = "http://mss.cmcc.com/OA_PageInquiryDeptEmpRelationInfoSrv", name = "OA_PageInquiryDeptEmpRelationInfoSrv")
@XmlSeeAlso({com.cmcc.mss.msgheader.ObjectFactory.class, ObjectFactory.class})
@SOAPBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)
public interface OAPageInquiryDeptEmpRelationInfoSrv {

    @WebMethod(action = "process")
    @WebResult(name = "OA_PageInquiryDeptEmpRelationInfoSrvResponse", targetNamespace = "http://mss.cmcc.com/OA_PageInquiryDeptEmpRelationInfoSrv", partName = "payload")
    public OAPageInquiryDeptEmpRelationInfoSrvResponse process(
        @WebParam(partName = "payload", name = "OA_PageInquiryDeptEmpRelationInfoSrvRequest", targetNamespace = "http://mss.cmcc.com/OA_PageInquiryDeptEmpRelationInfoSrv")
        OAPageInquiryDeptEmpRelationInfoSrvRequest payload
    );
}
