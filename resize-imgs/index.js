const imMagic=require("imagmagick")
const fs=require("fs")
const os=require("os")
const {promisify}=require("util")
const AWS=require("aws-sdk")
const uuid4=require("uuid/v4")

//convert the resize function to async one that returns a promise
const resizeAsync=promisify(imMagic.resize)


AWS.config.update({region:"us-east-1"})
const s3=new AWS.S3()

exports.handler=(event)=>{
    let processedFiles=event.records.map(async(record)=>{
        const bucket=record.buckets.name
        const fileName=record.s3.object.key
        var params={
            Bucket:bucket,
            Key:fileName
        }

        //get image forms3
        let inputData=await s3.getObject(params).promise()

        //first create a temp distination on the lambda container environment, because processing happens there
        //generate unique name for our target image file

        const tempDir=os.tmpdir()+'/'+uuid4+'.jpg'
        let resizeArgs={
            srcData:inputData.Body,
            dstPath:tempDir,
            width:150 
        }

        //resize file with imageMagick--->doesn't use promises so we going to use promisify
        await resizeAsync(resizeArgs)



    })

    await Promise.all(processedFiles)
    console.log("all files are done")
    return "done"
}