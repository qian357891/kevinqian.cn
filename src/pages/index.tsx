import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import styles from "./index.module.scss";

const Banner: { Svg: React.ComponentType<React.ComponentProps<"svg">> } = {
  Svg: require("@site/static/img/banner.svg").default,
};

function HomepageHeader({ Svg }) {
  return (
    <>
      <div className={styles.banner}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerContent}>
            <div className={clsx([styles.firstLine])}>
              你好，我是<span className={styles.name}>Kevin</span>!
            </div>
            <p className={styles.description}>偶尔会在这里做记录</p>
            <div>
              <Link to="/blog" className={styles.button}>
                进入博客
              </Link>
            </div>
          </div>
        </div>
        <Svg className={styles.bannerSvg} role="img" />
      </div>
    </>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader {...Banner} />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
