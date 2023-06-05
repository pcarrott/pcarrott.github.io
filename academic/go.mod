module github.com/pcarrott/pcarrott.github.io/academic

go 1.15

require (
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-netlify v1.0.0 // indirect
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-netlify-cms v1.0.0 // indirect
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-reveal v1.0.0 // indirect
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy/v5 v5.7.1-0.20230420205746-951c7b6f709d
)

replace (
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-reveal => ../modules/wowchemy-plugin-reveal
	github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy/v5 => ../modules/wowchemy
)
