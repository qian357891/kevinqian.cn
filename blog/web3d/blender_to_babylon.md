---
date: 2022-11-22
category:
  - 前端
tag:
  - Babylon.js
archive: true
---

# 通过babylon.js使用blender导出的模型创建web3d应用



### 什么是babylon.js？

[Babylon.js](https://www.babylonjs.com/)，是由微软使用TypeScript开发的一款开源的web端3d游戏引擎，与three.js一样都支持webgpu。但相比于three.js来说，babylon.js更强大。现在在github上18.8K的star：

> babylon.js的github仓库链接：[BabylonJS/Babylon.js: Babylon.js is a powerful, beautiful, simple, and open game and rendering engine packed into a friendly JavaScript framework. (github.com)](https://github.com/BabylonJS/Babylon.js)

而它的竞品three.js在github上有87k的star：[mrdoob/three.js: JavaScript 3D Library. (github.com)](https://github.com/mrdoob/three.js)



### 为什么是babylon.js？

虽然说这两引擎在github上的star相差很多，但我认为这是由于**时机**的关系。three.js在2009年发布，而babylon.js在2013年发布。

其次，three.js是由社区推动，并且使用javascript开发。而babylon.js有个有钱的爹——微软，使用TypeScript开发，这意味着当你进行开发时，你能够得到更好的类型提示，如果不熟悉TypeScript的朋友，可以看我的专栏：[TS入门小记 - 跟我一起秃秃秃的专栏 - 掘金 (juejin.cn)](https://juejin.cn/column/7163571163137277965)。

babylon.js的官方社区也在快速的发展：[Babylon.js (babylonjs.com)](https://forum.babylonjs.com/)，如果你在官方论坛中提问的话，大概率半小时内能得到答复。

而且，非常重要的一点。babylon.js的定位是web3d游戏引擎，而three.js的定位为一个web3d库。

综上，我选择babylon.js，下面将先进行对模型的处理。



### 一、导出模型

> 本篇文章导出模型的建模软件为blender。

如果模型设置了修改器，请先全部应用（`a`全选后右键点击，选择转换到网格，勾选保留原有）。建议ctrl+j合并。

随后导出glb文件（建议勾选压缩）。



### 二、压缩材质图片

大多数时候我们导出的文件很大是因为材质图片太大。

**[gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)**提供了一个工具来对glb/gltf文件拆解和合成，我们先对这个工具进行下载，请确保你的操作系统上安装了node.js：

```
npm install -g gltf-pipeline
```

或者使用pnpm

```
pnpm add -g gltf-pipeline
```



使用：`gltf-pipeline -i model.gltf -t `命令模板，将纹理材质图片单独输出

随后，你可以通过ps，将图片都保存为`web格式`，选择图片的品质，可以尝试选择`低`，大多数时候图片的品质并没有什么影响。但是空间却只有原来的最多1/10。

然后使用：`gltf-pipeline -i model.gltf -o model.glb` 命令模板，将分离的模型文件和纹理材质文件统一打包转为单体glb文件。 



> 本篇文章使用github存储模型文件，我们可以使用任何允许跨域的网站来导入我们的模型文件。

### 三、在playground中使用模型

babylon也有editor，这是一个很有潜力的项目。不过这个软件不太好用，而且是由社区开发的。所以我建议入门选手使用playground来编写程序和使用模型：

[Babylon.js Playground (babylonjs-playground.com)](https://www.babylonjs-playground.com/)

我们选择语言为TypeScript，如果没有合适的模型的朋友，可以使用我github仓库中的两个模型来进行学习：[qian357891/MeshesLibrary: A assets library for glb file (github.com)](https://github.com/qian357891/MeshesLibrary)

我们在playground中输入以下代码，关于各个变量和函数的作用，可以看我的注释：

```ts
class Playground {
  public static CreateScene(
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement
  ): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);// 创建一个场景,这是一个必须的常量/变量，参数为Playground类中CreateScene静态方法的engine属性

    // 创建一个相机，这也是一个必须的常量/变量。这个相机是BABYLON.ArcRotateCamera类的一个实例，这个相机能够让我们使用鼠标和触摸对模型进行观看。
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );

    // 导入模型
    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://cdn.jsdelivr.net/gh/qian357891/MeshesLibrary@b393a2d7702579e657ceb3c5a150ba650f13b68a/",
      "temple_single_s.glb",
      scene,
      function (meshes) {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment();
      }
    );

    // 该静态方法返回的是我们定义的scene场景
    return scene;
  }
}
```

关于在playground中导入外部资源，也可以看看[官方的文档](https://doc.babylonjs.com/toolsAndResources/thePlayground/externalPGAssets#using-jsdelivrcom)，在本篇文章中，我们使用的是jsdelivr.com。



随后我们点击抬头栏目中的`下载`按钮，便可以得到一个打包好的压缩文件。

![image-20221123191055055](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221123191055055.png)



下载好压缩文件后，打开压缩文件中的`index.html`。发现依赖包已经通过cdn引入了依赖包，你可以直接打开html文件进行预览：
[代码片段](https://code.juejin.cn/pen/7163096766378672162)

