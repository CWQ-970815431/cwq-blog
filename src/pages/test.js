import React from "react";

import Layout from "@theme/Layout";

function test(props){
    const title = "测试"
    const description = 'none'
    return(
        <Layout
            title={title}
            description={description}
            wrapperClassName="blog-list__page"
        >

        </Layout>
        )
}

export default test