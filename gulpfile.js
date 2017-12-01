var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var babel = require("gulp-babel");

var uglify = require('gulp-uglify');
var pump = require('pump');
var uglifyjs = require('uglify-es');
var composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);

gulp.task('copy-public', function () {
    console.log('to copy-public ...');
    return gulp.src('public/**', {
            base: 'public'
        })
        .pipe(gulp.dest('build/public'));
});

gulp.task('copy-views', function () {
    console.log('to copy-views ...');
    return gulp.src(['views/**', 'package.json'], {
            base: '.'
        })
        .pipe(gulp.dest('build'));
});

gulp.task('css-rev', ['copy-public', 'copy-views'], function () {
    console.log('to css-rev ...');
    return gulp.src('build/public/default/assets/css/*/*.css', {
            base: 'build/public'
        })
        .pipe(gulp.dest('build/public')) // copy original assets to build dir 
        .pipe(rev())
        // .pipe(gulp.dest('build')) // write rev'd assets to build dir 
        .pipe(rev.manifest({
            path: 'rev-manifest-css.json'
        }))
        .pipe(gulp.dest('build/public'));
});

gulp.task('css', ['css-rev'], function () {
    console.log('to css ...');
    return gulp.src(['build/public/rev-manifest-css.json', 'build/views/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/views'));
});

gulp.task('compressCss', ['css'], function () {
    return gulp.src('build/public/default/assets/css/*/*.css', {
            base: 'build/public'
        })
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('build/public'));
});


gulp.task('js-rev', ['compressCss'], function () {
    console.log('to js-rev ...');
    return gulp.src('build/public/default/assets/js/*/*.js', {
            base: 'build/public'
        })
        .pipe(gulp.dest('build/public')) // copy original assets to build dir 
        .pipe(rev())
        // .pipe(gulp.dest('build')) // write rev'd assets to build dir 
        .pipe(rev.manifest({
            path: 'rev-manifest-js.json'
        }))
        .pipe(gulp.dest('build/public'));
});

gulp.task('js', ['js-rev'], function () {
    console.log('to js ...');
    return gulp.src(['build/public/rev-manifest-js.json', 'build/views/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/views'));
});

// babel is working but I don't want use it
// gulp.task('toES5', ['js'], function () {
//     return gulp.src("build/default/assets/js/*/*.js") // ES6 源码存放的路径
//         .pipe(babel())
//         .pipe(gulp.dest("build/default/assets/js/")); //转换成 ES5 存放的路径
// });

gulp.task('compressJs', ['js'], function (cb) {
    // 动态的js需要处理
    pump([
            gulp.src(['build/public/default/assets/js/*/*.js'], {
                base: 'build'
            }),
            minify({}),
            gulp.dest('build')
        ],
        cb
    );
});

gulp.task('compressHtml', ['compressJs'], function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true //压缩HTML
        // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        // removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        // removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        // removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        // minifyJS: true, //压缩页面JS
        // minifyCSS: true //压缩页面CSS
    };
    return gulp.src('build/views/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/views'));

});

gulp.task('compressNode', ['compressHtml'], function (cb) {
    pump([
            gulp.src(['settings.js', 'model.js', 'db.js', 'app.js', 'init-db.js', 'routes/**/*.js', 'models/**/*.js'], {
                base: '.'
            }),
            minify({}),
            gulp.dest('build')
        ],
        cb
    );
});

gulp.task('compress', function (cb) {
    // pump([
    //         gulp.src(['routes/**/*.js', 'models/**/*.js', 'util/**/*.js', 'settings.js'], { base: '.' }),
    //         uglify(),
    //         gulp.dest('dist')
    //     ],
    //     cb
    // );
});

// gulp.task('rev', ['minify-html', 'minify-css'], function() {
//     gulp.src('views/Client/partial/main.html')
//         .pipe(rev())
//         .pipe(gulp.dest('dist/test'));
// });

gulp.task('default', ['compressNode'], function () {
    // place code for your default task here
});