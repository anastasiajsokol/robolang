window.addEventListener("load", () => {
    let template = "";

    fetch("template.java").then(response => response.text()).then(text => { template = text; console.log("Loaded template"); }).catch(() => { console.error("Failed to load template"); });

    // setup and define workspace

    Blockly.HSV_SATURATION = 0.8;

    Blockly.Blocks['move_forward'] = {
        init: function() {
            this.appendDummyInput().appendField("Forward");
            this.appendValueInput("tiles").setCheck(null).appendField("tiles");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['move_backward'] = {
        init: function() {
            this.appendDummyInput().appendField("Backwards");
            this.appendValueInput("tiles").setCheck(null).appendField("tiles");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['move_left'] = {
        init: function() {
            this.appendDummyInput().appendField("Left");
            this.appendValueInput("tiles").setCheck(null).appendField("tiles");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['move_right'] = {
        init: function() {
            this.appendDummyInput().appendField("Right");
            this.appendValueInput("tiles").setCheck(null).appendField("tiles");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['move_clockwise'] = {
        init: function() {
            this.appendDummyInput().appendField("Clockwise");
            this.appendValueInput("quarters").setCheck(null).appendField("quarters");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['move_counterclockwise'] = {
        init: function() {
            this.appendDummyInput().appendField("Counterclockwise");
            this.appendValueInput("quarters").setCheck(null).appendField("quarters");
            this.setColour(195);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['program_start'] = {
        init: function() {
            this.appendDummyInput().appendField("Start");
            this.setColour(324);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setNextStatement(true);
        }
    };

    Blockly.defineBlocksWithJsonArray([{
        "type": "control_repeat",
        "message0": 'repeat %1 times %2',
        "args0": [
          {
            "type": "input_value",
            "name": "times",
          },
          {
            "type": "input_statement",
            "name": "body"
          }
        ],
        "nextStatement": null,
        "previousStatement": null,
        "colour": 324,
    }]);

    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
          {
            "kind": "category",
            "name": "Movement",
            "colour": "195",
            "contents": [
              {
                "kind": "block",
                "type": "move_forward"
              },
              {
                "kind": "block",
                "type": "move_backward"
              },
              {
                "kind": "block",
                "type": "move_right"
              },
              {
                "kind": "block",
                "type": "move_left"
              },
              {
                "kind": "block",
                "type": "move_clockwise"
              },
              {
                "kind": "block",
                "type": "move_counterclockwise"
              },
            ]
          },
          {
            "kind": "category",
            "name": "Control",
            "colour": "324",
            "contents": [
              {
                "kind": "block",
                "type": "program_start"
              },
              {
                "kind": "block",
                "type": "control_repeat"
              }
            ]
          },
          {
            "kind": "category",
            "name": "Constants",
            "colour": "159",
            "contents": [
                {
                    "kind": "block",
                    "type": "math_number"
                }
            ]
          }
        ]
    };
    
    const workspace = Blockly.inject('workspace', {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: false,
    });

    // compiler
    const robolang = new Blockly.Generator('RoboLang');

    robolang.ORDER_ATOMIC = 0;
    robolang.ORDER_BLOCK = 99;

    robolang["program_start"] = (block) => {
        robolang.repeat_var = 0; // hehe
        return "";
    };

    robolang["control_repeat"] = (block) => {
        let times = robolang.valueToCode(block, "times", robolang.ORDER_ATOMIC);
        times = (times == "") ? '1' : times;
        
        let expr = robolang.statementToCode(block, "body");

        let varname = String.fromCharCode(97 + robolang.repeat_var);
        robolang.repeat_var = (robolang.repeat_var + 1) % 26;

        return `for(int ${varname} = 0; ${varname} < ${times}; ++${varname}){\n${expr}\n}`;
    };

    robolang["move_forward"] = (block) => {
        let code = robolang.valueToCode(block, "tiles", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `forward(${code});`;
    };

    robolang["move_backward"] = (block) => {
        let code = robolang.valueToCode(block, "tiles", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `backward(${code});`;
    };

    robolang["move_left"] = (block) => {
        let code = robolang.valueToCode(block, "tiles", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `strafe_left(${code});`;
    };

    robolang["move_right"] = (block) => {
        let code = robolang.valueToCode(block, "tiles", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `strafe_right(${code});`;
    };

    robolang["move_clockwise"] = (block) => {
        let code = robolang.valueToCode(block, "quarters", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `right(${code});`;
    };

    robolang["move_counterclockwise"] = (block) => {
        let code = robolang.valueToCode(block, "quarters", robolang.ORDER_ATOMIC);
        code = (code == "") ? '1' : code;
        return `left(${code});`;
    };

    robolang['math_number'] = (block) => {
        const code = String(block.getFieldValue('NUM'));
        return [code, robolang.ORDER_ATOMIC];
    };

    robolang.scrub_ = (block, code, this_only) => {
        const next_block = block.nextConnection && block.nextConnection.targetBlock();
        if (next_block && !this_only) {
            return code + '\n' + robolang.blockToCode(next_block);
        }
        return code;
    };

    // compiling interface
    document.addEventListener("keydown", (key) => {
        if(key.key == "C"){
            let start = null;

            for(let stack of workspace.getTopBlocks(true)){
                if(stack.type == "program_start"){
                    if(start != null){
                        alert("Compile Error: program can only start in one place");
                        console.error(start);
                        console.error(stack);
                        throw new Error("Start point conflict");
                    } else {
                        start = stack;
                    }
                }
            }

            if(start == null){
                alert("Compile Error: no start point");
                throw new Error("No start point could be found");
            }

            const code = template.replace("{{code}}", robolang.blockToCode(start));

            console.log(code);
            window.display_code(code);
        }
    });
});