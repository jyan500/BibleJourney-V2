/* NOTE: 
	***** ALL CREDIT goes to https://github.com/beezischillin in his repo: https://github.com/beezischillin/react-TinyWrap *****
	I converted line 5 to be React.Component, converted the componentWillReceiveProps to the more updated componentDidUpdate, removed underscore from line 60, and line 78 to use React.createElement since I'm not using JSX for this project, those were the only changes made
*/
class TinyWrap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {editorInstance: 'tinymce_editor_' + this.generateUniqueID()};
    }

    generateUniqueID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

    //shouldComponentUpdate() {return false;}

    getInstance() {
        if (tinymce.get(this.state.editorInstance) && tinymce.get(this.state.editorInstance).initialized)
            return tinymce.get(this.state.editorInstance);

        return false;
    }

    // componentWillReceiveProps(props) {
    //     var tinywrap = this;

    //     if (tinymce.get(this.state.editorInstance) && tinymce.get(this.state.editorInstance).initialized) {
    //         if (tinymce.get(tinywrap.state.editorInstance).getContent() != props.content)
    //             tinymce.get(this.state.editorInstance).setContent((props.content) ? props.content : '');
    //     } else {
    //         if (this.delayedUpdate)
    //             clearInterval(this.delayedUpdate);

    //         this.delayedUpdate = setInterval(function(){
    //             if (tinymce.get(tinywrap.state.editorInstance) && tinymce.get(tinywrap.state.editorInstance).initialized) {
    //                 if (tinymce.get(tinywrap.state.editorInstance).getContent() != props.content)
    //                     tinymce.get(tinywrap.state.editorInstance).setContent((props.content) ? props.content : '');

    //                 clearInterval(tinywrap.delayedUpdate);
    //             }
    //         }, 100);
    //     }
    // }

    // converted from componentWillReceiveProps to getDerivedStateFromProps
    // set the tinyMCE's content based on the props that WILL be received, comparing it to its current editor content
    static getDerivedStateFromProps(nextProps, prevState) {
        var tinywrap = this;

        if (tinymce.get(prevState.editorInstance) && tinymce.get(prevState.editorInstance).initialized) {
            if (tinymce.get(prevState.editorInstance).getContent() != nextProps.content){
                tinymce.get(prevState.editorInstance).setContent((nextProps.content) ? nextProps.content : '');
            }

        // } else {
        //     if (this.delayedUpdate)
        //         clearInterval(this.delayedUpdate);

        //     this.delayedUpdate = setInterval(function(){
        //         if (tinymce.get(tinywrap.state.editorInstance) && tinymce.get(tinywrap.state.editorInstance).initialized) {
        //             if (tinymce.get(tinywrap.state.editorInstance).getContent() != nextProps.content)
        //                 tinymce.get(tinywrap.state.editorInstance).setContent((nextProps.content) ? nextProps.content : '');

        //             clearInterval(tinywrap.delayedUpdate);
        //         }
        //     }, 100);
        }
    	return null;
    }

    componentDidMount() {
        var tinywrap = this;

        tinymce.init({
            ...this.props.config,
            selector: '#' + this.state.editorInstance,
            init_instance_callback: function(ed) {
            ed.setContent((tinywrap.props.content) ? tinywrap.props.content : '');

            var events = ['NodeChange', 'change', 'keyup', 'undo', 'redo', 'cut', 'copy', 'paste'];

            events.forEach(function(e){
                ed.on(e, function(){
                    if (tinywrap.props.onChange && typeof tinywrap.props.onChange == 'function')
                    	// passes in the current editor value rather than event
                        tinywrap.props.onChange(tinymce.get(tinywrap.state.editorInstance).getContent());
                });
            });
        }}
    );
    }

    componentWillUnmount() {
        if (tinymce.get(this.state.editorInstance))
            tinymce.get(this.state.editorInstance).destroy();
    }


    render() {
        return (
            e('textarea', {id: this.state.editorInstance}) 
    );
    }
}