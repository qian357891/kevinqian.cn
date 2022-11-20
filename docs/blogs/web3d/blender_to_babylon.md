## 通过babylon.js使用blender模型创建web3d应用



### 一、导出模型

如果模型设置了修改器，请先全部应用（`a`全选后右键点击，选择转换到网格，勾选保留原有）。建议ctrl+j合并。

随后导出glb文件（建议勾选压缩）。



### 二、压缩材质图片

大多数时候我们导出的文件很大是因为材质图片太大。

**[gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)**提供了一个工具来对glb/gltf文件拆解和合成。

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



### 三、在playground中使用模型

babylon也有editor，这是一个很有潜力的项目。沮丧的是，我不太会使用这个app。所以我建议入门选手使用playground来编写程序和使用模型。