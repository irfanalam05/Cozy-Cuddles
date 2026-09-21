const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category =
        req.query.category ||
        req.body.category ||
        req.headers['x-product-category']

        const productType =
        req.query.product_type ||
        req.body.product_type ||
        req.headers['x-product-type']

        console.log('UPLOAD DATA:', {
        category,
        productType
    })

    if (!category || !productType) {
      return cb(new Error('Category and Product Type are required'))
    }

    const categoryFolderMap = {
        'Mosquito Beds': 'mosquito-bed',
        'Baby Playgyms': 'baby-playgyms',
        'Baby Tricycle': 'baby-tricycles',
        'Baby Bullets': 'baby-bullets',
        'Baby Walker': 'baby-walkers',
        'Ride On Toys': 'ride-on-toys',
        'Swings': 'swings',
        'Sleeping Bags': 'sleeping-bags',
        'Sleeping Swings': 'sleeping-swings'
    }

    const categoryFolder =
    categoryFolderMap[category] ||
    category.toLowerCase().replace(/\s+/g, '-')

    const productFolder = productType
      .toLowerCase()
      .replace(/\s+/g, '-')

    const uploadPath = path.join(
      __dirname,
      '../../public/products',
      categoryFolder,
      productFolder
    )

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    cb(null, uploadPath)
  },

  filename: (req, file, cb) => {
        const originalName = path.basename(file.originalname)

        const fileName = originalName
            .toLowerCase()
            .replace(/\s+/g, '-')

        const fileExtension = path.extname(fileName)
        const baseName = path.basename(fileName, fileExtension)

        const uniqueName = `${baseName}-${Date.now()}${fileExtension}`
        cb(null, uniqueName)
    }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/

    const extension = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    const mimeType = allowedTypes.test(file.mimetype)

    if (extension && mimeType) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed'))
    }
  }
})

module.exports = upload