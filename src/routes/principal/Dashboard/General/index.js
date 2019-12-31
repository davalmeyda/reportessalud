import React, { Component } from 'react';

import { Col, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import BienvenidoCard from "components/dashboard/general/BienvenidoCard";
import SiteAudience from "components/dashboard/CRM/SiteAudience";
import AdmisionChar from "components/dashboard/general/AdimisionChar";
import Widget from "components/Widget";

class GeneralPage extends Component {
    state = {}
    
    render() {
        return (
            <Auxiliary>
                <Row>
                    <Col span={24}>
                        <div className="gx-card">
                            <div className="gx-card-body">
                                <Row>
                                    <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                                        <BienvenidoCard />
                                    </Col>

                                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className="gx-visit-col">
                                        <AdmisionChar />
                                    </Col>

                                    <Col xl={6} lg={12} md={12} sm={12} xs={24} className="gx-audi-col">
                                        <SiteAudience />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Widget title='Programación de médicos en el día'>

                        </Widget>
                    </Col>
                    <Col xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Widget title='Atenciones en el día'>

                        </Widget>
                    </Col>
                    <Col xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Widget title=''>

                        </Widget>
                    </Col>
                </Row>
            </Auxiliary>
        );
    }
}

export default GeneralPage;