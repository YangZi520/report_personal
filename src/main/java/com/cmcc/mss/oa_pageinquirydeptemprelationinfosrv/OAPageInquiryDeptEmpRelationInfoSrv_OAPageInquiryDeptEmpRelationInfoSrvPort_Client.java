
package com.cmcc.mss.oa_pageinquirydeptemprelationinfosrv;

/**
 * Please modify this class to meet your needs
 * This class is not complete
 */

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * This class was generated by Apache CXF 3.2.4
 * 2018-05-23T16:37:00.555+08:00
 * Generated source version: 3.2.4
 *
 */
public final class OAPageInquiryDeptEmpRelationInfoSrv_OAPageInquiryDeptEmpRelationInfoSrvPort_Client {

    private static final QName SERVICE_NAME = new QName("http://mss.cmcc.com/OA_PageInquiryDeptEmpRelationInfoSrv", "OA_PageInquiryDeptEmpRelationInfoSrv");

    private OAPageInquiryDeptEmpRelationInfoSrv_OAPageInquiryDeptEmpRelationInfoSrvPort_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = OAPageInquiryDeptEmpRelationInfoSrv_Service.WSDL_LOCATION;
        if (args.length > 0 && args[0] != null && !"".equals(args[0])) {
            File wsdlFile = new File(args[0]);
            try {
                if (wsdlFile.exists()) {
                    wsdlURL = wsdlFile.toURI().toURL();
                } else {
                    wsdlURL = new URL(args[0]);
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }

        OAPageInquiryDeptEmpRelationInfoSrv_Service ss = new OAPageInquiryDeptEmpRelationInfoSrv_Service(wsdlURL, SERVICE_NAME);
        OAPageInquiryDeptEmpRelationInfoSrv port = ss.getOAPageInquiryDeptEmpRelationInfoSrvPort();

        {
        System.out.println("Invoking process...");
        com.cmcc.mss.oa_pageinquirydeptemprelationinfosrv.OAPageInquiryDeptEmpRelationInfoSrvRequest _process_payload = null;
        com.cmcc.mss.oa_pageinquirydeptemprelationinfosrv.OAPageInquiryDeptEmpRelationInfoSrvResponse _process__return = port.process(_process_payload);
        System.out.println("process.result=" + _process__return);


        }

        System.exit(0);
    }

}
